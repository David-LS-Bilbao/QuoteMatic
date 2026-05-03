import mongoose from "mongoose";
import { Request, Response } from "express";

import { Author } from "../../models/Author";
import { Quote } from "../../models/Quote";
import { QuoteType } from "../../models/QuoteType";
import { Situation } from "../../models/Situation";
import type { AuthorType, SourceType, VerificationStatus } from "../../types/domain.types";

// ── Quotable API types ────────────────────────────────────────────────────────

interface QuotableAuthor {
  _id: string;
  name: string;
  slug: string;
  bio?: string;
  description?: string;
  quoteCount: number;
}

interface QuotableQuote {
  _id: string;
  content: string;
  author: string;
  authorSlug: string;
  tags: string[];
  length: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const normalizeText = (value: string): string =>
  value.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const getUser = (req: Request) => ({
  isAuthenticated: true,
  role: req.session.role ?? null,
  ageGroup: req.session.ageGroup ?? null,
});

// Maps Quotable tags to project QuoteType slugs. Fallback: wise_advice.
const TAG_TO_QUOTE_TYPE: Record<string, string> = {
  inspirational: "motivational",
  motivational:  "motivational",
  success:       "motivational",
  stoicism:      "stoic",
  philosophy:    "philosophical",
  knowledge:     "philosophical",
  truth:         "philosophical",
  life:          "wise_advice",
  wisdom:        "wise_advice",
  "famous-quotes": "wise_advice",
  leadership:    "wise_advice",
  work:          "stoic",
  "work-ethic":  "stoic",
  humor:         "funny",
  humorous:      "funny",
  technology:    "realistic",
  education:     "wise_advice",
};

const resolveQuoteTypeSlug = (tags: string[]): string => {
  for (const tag of tags) {
    const slug = TAG_TO_QUOTE_TYPE[tag.toLowerCase()];
    if (slug) return slug;
  }
  return "wise_advice";
};

// ── Quotable fetch ────────────────────────────────────────────────────────────

// Top authors by quote count — used for the initial suggested list on page load.
const fetchSuggestedAuthors = async (): Promise<QuotableAuthor[]> => {
  const url = `https://api.quotable.io/authors?sortBy=quoteCount&order=desc&limit=12`;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(6000),
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Quotable respondió con ${response.status}`);
  const data = await response.json() as { results?: QuotableAuthor[] };
  return data.results ?? [];
};

const fetchQuotableAuthors = async (query: string): Promise<QuotableAuthor[]> => {
  const url = `https://api.quotable.io/search/authors?query=${encodeURIComponent(query)}&limit=10`;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Quotable respondió con ${response.status}`);
  const data = await response.json() as { results?: QuotableAuthor[] };
  return data.results ?? [];
};

const fetchQuotableQuotesBySlug = async (authorSlug: string): Promise<QuotableQuote[]> => {
  const url = `https://api.quotable.io/quotes?authorSlug=${encodeURIComponent(authorSlug)}&limit=20&page=1`;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Quotable respondió con ${response.status}`);
  const data = await response.json() as { results?: QuotableQuote[] };
  return data.results ?? [];
};

// ── Shared render helper ──────────────────────────────────────────────────────

type ImportStep = "search" | "quotes" | "done";

interface ImportSummary {
  authorName: string;
  authorCreated: boolean;
  quotesCreated: number;
  duplicatesSkipped: number;
  errors: string[];
}

const renderImport = (
  res: Response,
  req: Request,
  step: ImportStep,
  opts: {
    authors?: QuotableAuthor[] | null;
    suggestedAuthors?: QuotableAuthor[] | null;
    suggestedError?: string | null;
    quotes?: QuotableQuote[] | null;
    authorName?: string;
    authorSlug?: string;
    query?: string;
    error?: string | null;
    msg?: string | null;
    importSummary?: ImportSummary | null;
  } = {}
): void => {
  res.render("admin/import", {
    title: "Importar frases | Admin | QuoteMatic",
    step,
    authors: opts.authors ?? null,
    suggestedAuthors: opts.suggestedAuthors ?? null,
    suggestedError: opts.suggestedError ?? null,
    quotes: opts.quotes ?? null,
    authorName: opts.authorName ?? "",
    authorSlug: opts.authorSlug ?? "",
    query: opts.query ?? "",
    error: opts.error ?? null,
    msg: opts.msg ?? null,
    importSummary: opts.importSummary ?? null,
    user: getUser(req),
  });
};

// ── Controllers ───────────────────────────────────────────────────────────────

export const renderImportPage = async (req: Request, res: Response): Promise<void> => {
  let suggestedAuthors: QuotableAuthor[] | null = null;
  let suggestedError: string | null = null;

  try {
    suggestedAuthors = await fetchSuggestedAuthors();
    if (suggestedAuthors.length === 0) {
      suggestedError = "No se pudieron cargar autores sugeridos. Puedes buscar manualmente.";
    }
  } catch {
    suggestedError = "No se pudieron cargar autores sugeridos. Puedes buscar manualmente.";
  }

  renderImport(res, req, "search", {
    msg: String(req.query.msg ?? "") || null,
    suggestedAuthors,
    suggestedError,
  });
};

export const searchQuotableAuthors = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.body as { query: string };

  if (!query?.trim()) {
    renderImport(res, req, "search", { error: "Escribe un nombre para buscar." });
    return;
  }

  try {
    const authors = await fetchQuotableAuthors(query.trim());
    renderImport(res, req, "search", {
      authors,
      query: query.trim(),
      error: authors.length === 0 ? "No se encontraron autores para esa búsqueda." : null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error de conexión";
    renderImport(res, req, "search", {
      query: query.trim(),
      error: `Quotable no disponible: ${message}`,
    });
  }
};

export const getAuthorQuotes = async (req: Request, res: Response): Promise<void> => {
  const slug = String(req.params.slug);
  const authorName = String(req.query.name ?? "");

  if (!slug) {
    res.redirect("/admin/import");
    return;
  }

  try {
    const quotes = await fetchQuotableQuotesBySlug(slug);
    renderImport(res, req, "quotes", {
      quotes,
      authorName,
      authorSlug: slug,
      error: quotes.length === 0 ? "No hay frases disponibles para este autor en Quotable." : null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error de conexión";
    renderImport(res, req, "quotes", {
      authorName,
      authorSlug: slug,
      error: `Quotable no disponible: ${message}`,
    });
  }
};

export const saveSelectedQuotes = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as { authorSlug?: string; authorName?: string; selectedIds?: string | string[] };
  const { authorSlug, authorName } = body;
  const ids = Array.isArray(body.selectedIds)
    ? body.selectedIds
    : body.selectedIds
    ? [body.selectedIds]
    : [];

  if (!authorSlug || ids.length === 0) {
    renderImport(res, req, "quotes", {
      authorName: authorName ?? "",
      authorSlug: authorSlug ?? "",
      error: "Selecciona al menos una frase para importar.",
    });
    return;
  }

  try {
    // Re-fetch quotes to get full content from Quotable
    const allQuotes = await fetchQuotableQuotesBySlug(authorSlug);
    const selectedQuotes = allQuotes.filter((q) => ids.includes(q._id));

    if (selectedQuotes.length === 0) {
      res.redirect("/admin/import?msg=" + encodeURIComponent("Error: no se encontraron las frases seleccionadas."));
      return;
    }

    // Load DB catalogs
    const [situations, quoteTypes] = await Promise.all([
      Situation.find({ isActive: true }).lean(),
      QuoteType.find({ isActive: true }).lean(),
    ]);

    if (situations.length === 0 || quoteTypes.length === 0) {
      res.redirect("/admin/import?msg=" + encodeURIComponent("Error: ejecuta el seed primero."));
      return;
    }

    const quoteTypeBySlug = new Map(
      quoteTypes.map((qt) => [qt.slug as string, qt._id as mongoose.Types.ObjectId])
    );
    const fallbackSituationId = situations[0]._id as mongoose.Types.ObjectId;
    const fallbackQuoteTypeId = (quoteTypeBySlug.get("wise_advice") ?? quoteTypes[0]._id) as mongoose.Types.ObjectId;

    // Find or create Author
    const resolvedAuthorName = (authorName?.trim() || selectedQuotes[0].author).trim();
    const normalizedAuthorName = normalizeText(resolvedAuthorName);
    const existingAuthor = await Author.findOne({ normalizedName: normalizedAuthorName });
    let authorId: mongoose.Types.ObjectId;
    let authorCreated = false;

    if (existingAuthor) {
      authorId = existingAuthor._id as mongoose.Types.ObjectId;
    } else {
      const created = await Author.create({
        name: resolvedAuthorName,
        normalizedName: normalizedAuthorName,
        authorType: "real" as AuthorType,
        sourceType: "unknown" as SourceType,
        verificationSource: "quotable",
        verificationStatus: "pending" as VerificationStatus,
        isVerified: false,
        isActive: true,
      });
      authorId = created._id as mongoose.Types.ObjectId;
      authorCreated = true;
    }

    // Save selected quotes
    let quotesCreated = 0;
    let duplicatesSkipped = 0;
    const errors: string[] = [];
    let situationRotation = 0;

    for (const q of selectedQuotes) {
      try {
        const textNormalized = normalizeText(q.content);
        const exists = await Quote.exists({ textNormalized, author: authorId });

        if (exists) {
          duplicatesSkipped++;
          continue;
        }

        const quoteTypeSlug = resolveQuoteTypeSlug(q.tags);
        const quoteTypeId = quoteTypeBySlug.get(quoteTypeSlug) ?? fallbackQuoteTypeId;
        const situationId = (situations[situationRotation % situations.length]._id as mongoose.Types.ObjectId) ?? fallbackSituationId;
        situationRotation++;

        await Quote.create({
          text: q.content.trim(),
          textNormalized,
          author: authorId,
          situation: situationId,
          quoteType: quoteTypeId,
          language: "en",
          contentRating: "all",
          sourceType: "unknown",
          sourceReference: `quotable:${q._id}`,
          verificationStatus: "pending",
          isActive: true,
        });

        quotesCreated++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`"${q.content.slice(0, 50)}…": ${msg}`);
      }
    }

    renderImport(res, req, "done", {
      authorName: resolvedAuthorName,
      authorSlug,
      importSummary: {
        authorName: resolvedAuthorName,
        authorCreated,
        quotesCreated,
        duplicatesSkipped,
        errors,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error inesperado.";
    res.redirect("/admin/import?msg=" + encodeURIComponent(`Error: ${message}`));
  }
};
