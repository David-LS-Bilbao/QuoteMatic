import dotenv from "dotenv";
import mongoose from "mongoose";

import { Author } from "../models/Author";
import { Quote } from "../models/Quote";
import { QuoteType } from "../models/QuoteType";
import { Situation } from "../models/Situation";
import type { AuthorType, SourceType, VerificationStatus } from "../types/domain.types";

dotenv.config();

// ── Config ──────────────────────────────────────────────────────────────────

const MAX_QUOTES = 30;
const QUOTABLE_URL = `https://api.quotable.io/quotes?limit=${MAX_QUOTES}&page=1`;

// ── Helpers ──────────────────────────────────────────────────────────────────

const normalizeText = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

// Mapea los tags de Quotable a los slugs de QuoteType del proyecto.
// Si ningún tag coincide, se usa "wise_advice" como fallback seguro.
const TAG_TO_QUOTE_TYPE: Record<string, string> = {
  inspirational:  "motivational",
  motivational:   "motivational",
  success:        "motivational",
  stoicism:       "stoic",
  philosophy:     "philosophical",
  knowledge:      "philosophical",
  truth:          "philosophical",
  life:           "wise_advice",
  wisdom:         "wise_advice",
  "famous-quotes": "wise_advice",
  leadership:     "wise_advice",
  work:           "stoic",
  "work-ethic":   "stoic",
  humor:          "funny",
  humorous:       "funny",
  technology:     "realistic",
  education:      "wise_advice",
};

const resolveQuoteTypeSlug = (tags: string[]): string => {
  for (const tag of tags) {
    const slug = TAG_TO_QUOTE_TYPE[tag.toLowerCase()];
    if (slug) return slug;
  }
  return "wise_advice";
};

// ── Quotable API types ────────────────────────────────────────────────────────

interface QuotableQuote {
  _id: string;
  content: string;
  author: string;
  authorSlug: string;
  tags: string[];
  length: number;
}

interface QuotableResponse {
  count: number;
  results: QuotableQuote[];
}

// ── Fetch ─────────────────────────────────────────────────────────────────────

const fetchQuotableQuotes = async (): Promise<QuotableQuote[]> => {
  const response = await fetch(QUOTABLE_URL, {
    signal: AbortSignal.timeout(10000),
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `Quotable API returned ${response.status} ${response.statusText}. ` +
      `La API puede estar temporalmente fuera de servicio.`
    );
  }

  const data = await response.json() as QuotableResponse;

  if (!Array.isArray(data.results)) {
    throw new Error("Respuesta de Quotable API inesperada: falta el campo 'results'.");
  }

  return data.results;
};

// ── Author cache ──────────────────────────────────────────────────────────────

// Evita múltiples consultas a DB para el mismo autor durante la misma ejecución.
const authorCache = new Map<string, mongoose.Types.ObjectId>();

const findOrCreateAuthor = async (
  authorName: string
): Promise<{ id: mongoose.Types.ObjectId; isNew: boolean }> => {
  const normalized = normalizeText(authorName);

  const cached = authorCache.get(normalized);
  if (cached) return { id: cached, isNew: false };

  const existing = await Author.findOne({ normalizedName: normalized }).lean();
  if (existing) {
    const id = existing._id as mongoose.Types.ObjectId;
    authorCache.set(normalized, id);
    return { id, isNew: false };
  }

  const created = await Author.create({
    name: authorName.trim(),
    normalizedName: normalized,
    authorType: "real" as AuthorType,
    sourceType: "unknown" as SourceType,
    verificationSource: "quotable",
    verificationStatus: "pending" as VerificationStatus,
    isVerified: false,
    isActive: true,
  });

  const id = created._id as mongoose.Types.ObjectId;
  authorCache.set(normalized, id);
  return { id, isNew: true };
};

// ── Main ──────────────────────────────────────────────────────────────────────

const run = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI no está definida. Comprueba tu archivo .env.");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB conectado.");

  // Cargar catálogos de DB. Si están vacíos, el seed no se ha ejecutado.
  const [situations, quoteTypes] = await Promise.all([
    Situation.find({ isActive: true }).lean(),
    QuoteType.find({ isActive: true }).lean(),
  ]);

  if (situations.length === 0) {
    throw new Error("No hay situaciones en DB. Ejecuta primero: npm run seed");
  }
  if (quoteTypes.length === 0) {
    throw new Error("No hay tipos de frase en DB. Ejecuta primero: npm run seed");
  }

  const situationBySlug = new Map(situations.map((s) => [s.slug, s._id as mongoose.Types.ObjectId]));
  const quoteTypeBySlug = new Map(quoteTypes.map((qt) => [qt.slug as string, qt._id as mongoose.Types.ObjectId]));
  const situationSlugs = situations.map((s) => s.slug);

  console.log(`Situaciones disponibles: ${situationSlugs.join(", ")}`);
  console.log(`Tipos disponibles: ${[...quoteTypeBySlug.keys()].join(", ")}`);
  console.log(`\nConsultando Quotable API (máx. ${MAX_QUOTES} frases)...`);

  const quotableQuotes = await fetchQuotableQuotes();
  console.log(`Recibidas ${quotableQuotes.length} frases de la API.\n`);

  let authorsCreated = 0;
  let quotesCreated = 0;
  let duplicatesSkipped = 0;
  let errors = 0;

  for (let i = 0; i < quotableQuotes.length; i++) {
    const q = quotableQuotes[i];

    try {
      // 1. Autor
      const { id: authorId, isNew: authorIsNew } = await findOrCreateAuthor(q.author);
      if (authorIsNew) {
        authorsCreated++;
        console.log(`  [autor+]  ${q.author}`);
      }

      // 2. Tipo de frase por tags
      const quoteTypeSlug = resolveQuoteTypeSlug(q.tags);
      const quoteTypeId =
        quoteTypeBySlug.get(quoteTypeSlug) ?? quoteTypeBySlug.get("wise_advice");

      if (!quoteTypeId) {
        console.warn(`  [skip]    Sin tipo de frase para: "${q.content.slice(0, 50)}..."`);
        duplicatesSkipped++;
        continue;
      }

      // 3. Situación por rotación — distribuye equitativamente entre las disponibles
      const situationSlug = situationSlugs[i % situationSlugs.length];
      const situationId = situationBySlug.get(situationSlug);

      if (!situationId) {
        console.warn(`  [skip]    Sin situación para índice ${i}`);
        duplicatesSkipped++;
        continue;
      }

      // 4. Deduplicación por textNormalized + author (índice único del modelo)
      const textNormalized = normalizeText(q.content);
      const alreadyExists = await Quote.exists({ textNormalized, author: authorId });

      if (alreadyExists) {
        console.log(`  [dup]     "${q.content.slice(0, 65)}"`);
        duplicatesSkipped++;
        continue;
      }

      // 5. Crear frase con metadatos de fuente
      await Quote.create({
        text: q.content.trim(),
        textNormalized,
        author: authorId,
        situation: situationId,
        quoteType: quoteTypeId,
        language: "en",
        contentRating: "all",
        sourceType: "unknown",
        // Guarda el ID externo en sourceReference para trazabilidad
        sourceReference: `quotable:${q._id}`,
        verificationStatus: "pending",
        isActive: true,
      });

      quotesCreated++;
      console.log(`  [ok]      [${quoteTypeSlug}/${situationSlug}] "${q.content.slice(0, 65)}"`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  [error]   "${q.content?.slice(0, 50)}" — ${message}`);
      errors++;
    }
  }

  console.log("\n─── Resumen de importación ───────────────────────────");
  console.log(`  Autores creados:       ${authorsCreated}`);
  console.log(`  Frases creadas:        ${quotesCreated}`);
  console.log(`  Duplicados omitidos:   ${duplicatesSkipped}`);
  console.log(`  Errores:               ${errors}`);
  console.log("──────────────────────────────────────────────────────");

  if (errors > 0) {
    process.exitCode = 1;
  }
};

run()
  .catch((err) => {
    console.error("\nImportación fallida:", err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
    console.log("Conexión MongoDB cerrada.");
  });
