import dotenv from "dotenv";
import mongoose from "mongoose";

import { Author } from "../models/Author";
import { Favorite } from "../models/Favorite";
import { Quote } from "../models/Quote";
import { QuoteType } from "../models/QuoteType";
import { Situation } from "../models/Situation";

import type {
  ContentRating,
  QuoteTypeSlug,
  SourceType,
  VerificationStatus,
} from "../types/domain.types";

dotenv.config();

type QuoteSeedItem = {
  text: string;
  authorName: string;
  situationSlug: string;
  quoteTypeSlug: QuoteTypeSlug;
  contentRating: ContentRating;
  sourceType: SourceType;
  sourceReference?: string;
  verificationStatus: VerificationStatus;
};

const normalizeText = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
};

const connectSeedDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("MONGODB_URI is not defined. Seed aborted.");
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected for seed");
};

const runSeed = async (): Promise<void> => {
  await connectSeedDatabase();

  console.log("Cleaning previous seed data...");
  await Favorite.deleteMany({});
  await Quote.deleteMany({});
  await Author.deleteMany({});
  await Situation.deleteMany({});
  await QuoteType.deleteMany({});

  console.log("Creating authors...");

  // Dataset curado: autores históricos verificables, ficticios conocidos
  // y QuoteMatic como autor explícito de frases de demo originales.
  const authors = await Author.insertMany([
    // ── Históricos ──────────────────────────────────────────────────────────
    {
      name: "Marco Aurelio",
      normalizedName: normalizeText("Marco Aurelio"),
      authorType: "historical",
      sourceType: "book",
      sourceWork: "Meditaciones",
      verificationStatus: "pending",
      isVerified: false,
      isActive: true,
    },
    {
      name: "Séneca",
      normalizedName: normalizeText("Séneca"),
      authorType: "historical",
      sourceType: "book",
      sourceWork: "Epístolas Morales",
      verificationStatus: "pending",
      isVerified: false,
      isActive: true,
    },
    {
      name: "Epicteto",
      normalizedName: normalizeText("Epicteto"),
      authorType: "historical",
      sourceType: "book",
      sourceWork: "Enquiridión",
      verificationStatus: "pending",
      isVerified: false,
      isActive: true,
    },
    {
      name: "Aristóteles",
      normalizedName: normalizeText("Aristóteles"),
      authorType: "historical",
      sourceType: "book",
      sourceWork: "Ética a Nicómaco",
      verificationStatus: "pending",
      isVerified: false,
      isActive: true,
    },
    {
      name: "Platón",
      normalizedName: normalizeText("Platón"),
      authorType: "historical",
      sourceType: "book",
      sourceWork: "Apología",
      verificationStatus: "pending",
      isVerified: false,
      isActive: true,
    },
    {
      name: "Confucio",
      normalizedName: normalizeText("Confucio"),
      authorType: "historical",
      sourceType: "book",
      sourceWork: "Analectas",
      verificationStatus: "pending",
      isVerified: false,
      isActive: true,
    },
    {
      name: "Lao-Tse",
      normalizedName: normalizeText("Lao-Tse"),
      authorType: "historical",
      sourceType: "book",
      sourceWork: "Tao Te Ching",
      verificationStatus: "pending",
      isVerified: false,
      isActive: true,
    },
    {
      name: "Friedrich Nietzsche",
      normalizedName: normalizeText("Friedrich Nietzsche"),
      authorType: "historical",
      sourceType: "book",
      sourceWork: "Así habló Zaratustra",
      verificationStatus: "pending",
      isVerified: false,
      isActive: true,
    },
    {
      name: "Oscar Wilde",
      normalizedName: normalizeText("Oscar Wilde"),
      authorType: "historical",
      sourceType: "book",
      sourceWork: "El retrato de Dorian Gray",
      verificationStatus: "pending",
      isVerified: false,
      isActive: true,
    },
    {
      name: "Miguel de Cervantes",
      normalizedName: normalizeText("Miguel de Cervantes"),
      authorType: "historical",
      sourceType: "book",
      sourceWork: "Don Quijote de la Mancha",
      verificationStatus: "pending",
      isVerified: false,
      isActive: true,
    },
    // ── Ficticios ────────────────────────────────────────────────────────────
    {
      name: "Yoda",
      normalizedName: normalizeText("Yoda"),
      authorType: "fictional",
      sourceType: "movie",
      sourceWork: "Star Wars",
      verificationStatus: "pending",
      isVerified: false,
      isActive: true,
    },
    {
      name: "Homer Simpson",
      normalizedName: normalizeText("Homer Simpson"),
      authorType: "fictional",
      sourceType: "tv_show",
      sourceWork: "The Simpsons",
      verificationStatus: "pending",
      isVerified: false,
      isActive: true,
    },
    {
      name: "Gandalf",
      normalizedName: normalizeText("Gandalf"),
      authorType: "fictional",
      sourceType: "movie",
      sourceWork: "El Señor de los Anillos",
      verificationStatus: "pending",
      isVerified: false,
      isActive: true,
    },
    // ── Demo ────────────────────────────────────────────────────────────────
    // Autor explícito para frases originales de demo.
    // No simula atribuciones a personas reales.
    {
      name: "QuoteMatic",
      normalizedName: normalizeText("QuoteMatic"),
      authorType: "fictional",
      sourceType: "original",
      verificationStatus: "pending",
      isVerified: false,
      isActive: true,
    },
  ]);

  const authorByName = new Map(authors.map((a) => [a.name, a._id]));

  console.log("Creating situations...");

  const situations = await Situation.insertMany([
    {
      name: "Trabajo",
      slug: "trabajo",
      description: "Frases para afrontar retos laborales.",
      isActive: true,
    },
    {
      name: "Estudios",
      slug: "estudios",
      description: "Frases para momentos de aprendizaje y concentración.",
      isActive: true,
    },
    {
      name: "Estrés",
      slug: "estres",
      description: "Frases para recuperar calma y perspectiva.",
      isActive: true,
    },
    {
      name: "Decisiones difíciles",
      slug: "decisiones-dificiles",
      description: "Frases para pensar antes de elegir.",
      isActive: true,
    },
  ]);

  const situationBySlug = new Map(situations.map((s) => [s.slug, s._id]));

  console.log("Creating quote types...");

  const quoteTypes = await QuoteType.insertMany([
    {
      name: "Estoica",
      slug: "stoic",
      description: "Frases centradas en autocontrol, perspectiva y virtud.",
      contentRating: "all",
      isActive: true,
    },
    {
      name: "Filosófica",
      slug: "philosophical",
      description: "Frases para reflexionar sobre la vida y las decisiones.",
      contentRating: "all",
      isActive: true,
    },
    {
      name: "Motivacional",
      slug: "motivational",
      description: "Frases para impulsar acción y constancia.",
      contentRating: "all",
      isActive: true,
    },
    {
      name: "Divertida",
      slug: "funny",
      description: "Frases ligeras con tono humorístico.",
      contentRating: "teen",
      isActive: true,
    },
    {
      name: "Realista",
      slug: "realistic",
      description: "Frases directas y prácticas.",
      contentRating: "teen",
      isActive: true,
    },
    {
      name: "Sarcástica",
      slug: "sarcastic",
      description: "Frases con ironía o sarcasmo.",
      contentRating: "adult",
      isActive: true,
    },
    {
      name: "Consejo sabio",
      slug: "wise_advice",
      description: "Frases con tono de consejo o guía.",
      contentRating: "all",
      isActive: true,
    },
    {
      name: "Excusa",
      slug: "excuse",
      description: "Frases con tono de excusa o evasiva humorística.",
      contentRating: "teen",
      isActive: true,
    },
  ]);

  const quoteTypeBySlug = new Map(quoteTypes.map((qt) => [qt.slug, qt._id]));

  console.log("Creating quotes...");

  // 156 frases únicas por (textNormalized + author), cubriendo 32 combinaciones.
  // Fuente: dataset curado ChatGPT (mayo 2026).
  // Mapeo de campos externos al enum de dominio:
  //   fictional_source / original_demo → "pending"
  //   essay → "book"
  //   4 duplicados (mismo texto+autor en varias situaciones) eliminados:
  //     Oscar Wilde "Puedo resistir..." → solo trabajo×excuse
  //     Homer Simpson "Intentarlo es..." → solo trabajo×sarcastic
  //     Yoda "Hazlo o no..." → solo estres×funny
  const quotesSeed: QuoteSeedItem[] = [

    // ════════════════════════════════════════════════════════════════════════
    // TRABAJO  (40 frases — 5 por tipo)
    // ════════════════════════════════════════════════════════════════════════

    // trabajo × stoic ─────────────────────────────────────────────────────
    {
      text: "Haz lo necesario; casi todo lo que decimos y hacemos no hace falta.",
      authorName: "Marco Aurelio",
      situationSlug: "trabajo",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Meditaciones 4.24",
      verificationStatus: "manual_verified",
    },
    {
      text: "Trabaja sin drama: tu tarea de hoy no necesita epopeya, necesita presencia.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "En el trabajo, la calma no llega cuando baja el caos; llega cuando dejas de obedecerlo.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "No controles toda la oficina; controla la siguiente acción razonable.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Si el día se complica, reduce el ámbito y cumple bien lo inmediato.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // trabajo × philosophical ─────────────────────────────────────────────
    {
      text: "La virtud está en nuestro poder, y también lo está no huir de lo que toca hacer.",
      authorName: "Aristóteles",
      situationSlug: "trabajo",
      quoteTypeSlug: "philosophical",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Ética nicomaquea 3.5",
      verificationStatus: "manual_verified",
    },
    {
      text: "Un trabajo también pregunta quién eres cuando nadie aplaude el resultado.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "philosophical",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Hay días en que trabajar es producir, y otros en que trabajar es sostener criterio.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "philosophical",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Lo profesional no siempre es brillante; a veces es simplemente no traicionarte por prisa.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "philosophical",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Un empleo paga horas; un oficio, cuando madura, también educa la mirada.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "philosophical",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // trabajo × motivational ──────────────────────────────────────────────
    {
      text: "Lo que no me mata me hace más fuerte.",
      authorName: "Friedrich Nietzsche",
      situationSlug: "trabajo",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Crepúsculo de los ídolos, máx. 8",
      verificationStatus: "manual_verified",
    },
    {
      text: "Avanza aunque no te sientas listo: muchas veces la confianza llega después del envío.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Tu progreso laboral no necesita permiso; necesita repetir hoy una mejor versión de ayer.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Hay semanas que no se ganan con talento, sino con constancia que no hace ruido.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Haz una cosa bien, luego otra: así también se construye una carrera.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // trabajo × funny ─────────────────────────────────────────────────────
    {
      text: "La experiencia es el nombre que cada cual da a sus errores.",
      authorName: "Oscar Wilde",
      situationSlug: "trabajo",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "book",
      sourceReference: "Lady Windermere's Fan, Acto 4",
      verificationStatus: "manual_verified",
    },
    {
      text: "Reunión productiva: esa hermosa leyenda que siempre reaparece el lunes.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Mi plan laboral era sencillo, hasta que la realidad quiso participar.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Hoy rendí muchísimo: sobreviví al chat, al correo y a una videollamada sin sentido.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "No estoy procrastinando; estoy dejando que las ideas fermenten con dignidad.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // trabajo × realistic ─────────────────────────────────────────────────
    {
      text: "El sabio pone su felicidad en su propio trabajo, no en la reacción de otros.",
      authorName: "Marco Aurelio",
      situationSlug: "trabajo",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Meditaciones 6.51",
      verificationStatus: "manual_verified",
    },
    {
      text: "Trabajar bien no siempre se nota enseguida, pero trabajar mal suele presentarse solo.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Hay tareas que no inspiran; aun así, si importan, conviene terminarlas.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "La organización no resuelve todo, pero reduce bastante la cantidad de caos decorativo.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "El trabajo estable no siempre es emocionante; a veces su mérito es precisamente ese.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // trabajo × sarcastic ─────────────────────────────────────────────────
    {
      text: "Intentarlo es el primer paso hacia el fracaso.",
      authorName: "Homer Simpson",
      situationSlug: "trabajo",
      quoteTypeSlug: "sarcastic",
      contentRating: "teen",
      sourceType: "tv_show",
      sourceReference: "The Simpsons, S09E09",
      verificationStatus: "pending",
    },
    {
      text: "Si el plan sale raro, siempre podemos llamarlo enfoque experimental y mirar al frente.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "sarcastic",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "En oficina, a veces la prioridad no es la urgente, sino la que grita con mejor marketing.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "sarcastic",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Hay jefes que piden iniciativa, siempre que coincida exactamente con la suya.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "sarcastic",
      contentRating: "adult",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Cuando nadie sabe qué hacer, suele nacer un documento con título optimista.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "sarcastic",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // trabajo × wise_advice ───────────────────────────────────────────────
    {
      text: "No te avergüences de corregir tus faltas.",
      authorName: "Confucio",
      situationSlug: "trabajo",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Analectas 1.8",
      verificationStatus: "manual_verified",
    },
    {
      text: "Llega a tiempo, escribe claro y deja menos asuntos abiertos de los que recibiste.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Antes de responder en caliente, pregunta si el problema pide acción o solo ego.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Si algo puede resolverse con una nota breve, ahórrale al mundo un discurso heroico.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "En el trabajo, la fiabilidad pequeña repetida vale más que el brillo esporádico.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // trabajo × excuse ────────────────────────────────────────────────────
    {
      text: "Puedo resistir todo excepto la tentación.",
      authorName: "Oscar Wilde",
      situationSlug: "trabajo",
      quoteTypeSlug: "excuse",
      contentRating: "teen",
      sourceType: "book",
      sourceReference: "Lady Windermere's Fan, Acto 1",
      verificationStatus: "manual_verified",
    },
    {
      text: "No lo entregué tarde; lo dejé madurar hasta su punto de lectura amable.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "excuse",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "No me distraje: hice una auditoría completa de pestañas que no aportaban nada.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "excuse",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "El correo no quedó sin responder; entró en una pausa estratégica de alta reflexión.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "excuse",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Mi retraso no fue improductivo; estaba reuniendo contexto para equivocarme menos.",
      authorName: "QuoteMatic",
      situationSlug: "trabajo",
      quoteTypeSlug: "excuse",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // ════════════════════════════════════════════════════════════════════════
    // ESTUDIOS  (39 frases — 4 en estudios×excuse por duplicado Homer eliminado)
    // ════════════════════════════════════════════════════════════════════════

    // estudios × stoic ────────────────────────────────────────────────────
    {
      text: "Si algo no depende de ti, recuerda que no te pertenece.",
      authorName: "Epicteto",
      situationSlug: "estudios",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Enquiridión 1",
      verificationStatus: "manual_verified",
    },
    {
      text: "Estudiar también es soportar el no saber sin convertirlo en pánico.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "No pidas motivación eterna; pide disciplina suficiente para abrir el tema hoy.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Un examen no decide tu valor; solo mide algo pequeño en un momento concreto.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Si la materia pesa, parte el esfuerzo; la serenidad también se programa.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // estudios × philosophical ────────────────────────────────────────────
    {
      text: "La vida no examinada no merece ser vivida.",
      authorName: "Platón",
      situationSlug: "estudios",
      quoteTypeSlug: "philosophical",
      contentRating: "teen",
      sourceType: "book",
      sourceReference: "Apología 38a",
      verificationStatus: "manual_verified",
    },
    {
      text: "Estudiar no solo acumula datos; también afina las preguntas con las que miras el mundo.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "philosophical",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Leer con atención es una forma discreta de reorganizar la cabeza.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "philosophical",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Hay materias que no se entienden de golpe; se entienden por capas, como una ciudad.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "philosophical",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Aprender bien es sospechar del resumen fácil cuando el problema sigue siendo profundo.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "philosophical",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // estudios × motivational ─────────────────────────────────────────────
    {
      text: "La vida no es corta; la acortamos cuando la malgastamos.",
      authorName: "Séneca",
      situationSlug: "estudios",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "De la brevedad de la vida 1",
      verificationStatus: "manual_verified",
    },
    {
      text: "Cada página trabajada hoy le quita poder a la angustia de mañana.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "No esperes sentirte brillante para empezar: empieza, y dale a la mente algo que hacer.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Quince minutos sinceros de estudio vencen a una hora entera de culpa elegante.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Un tema difícil no es una muralla; es una puerta que solo abre insistiendo.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // estudios × funny ────────────────────────────────────────────────────
    {
      text: "El que lee mucho y anda mucho, ve mucho y sabe mucho.",
      authorName: "Miguel de Cervantes",
      situationSlug: "estudios",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "book",
      sourceReference: "Don Quijote II, 25",
      verificationStatus: "manual_verified",
    },
    {
      text: "Mi cerebro entendió el tema justo cuando el examen decidió no colaborar.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Yo no memorizo tarde; simplemente ofrezco una interpretación improvisada del temario.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Estudiar con vídeos a doble velocidad es mi manera de sentir control sin evidencia.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "El subrayador iba muy bien hasta que empezó a resumir todo el libro.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // estudios × realistic ────────────────────────────────────────────────
    {
      text: "Sin pensar en lo lejano, habrá problemas cerca.",
      authorName: "Confucio",
      situationSlug: "estudios",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Analectas 15.11",
      verificationStatus: "manual_verified",
    },
    {
      text: "Si el examen es en tres días, no negocies como si faltaran tres meses.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "No todo necesita una sesión maratón: a veces conviene estudiar menos y recordar más.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Un resumen bonito no compensa no haber practicado ejercicios.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Aprender también incluye aburrirse un poco sin abandonar a los diez minutos.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // estudios × sarcastic ────────────────────────────────────────────────
    {
      text: "Hoy la gente sabe el precio de todo y el valor de nada.",
      authorName: "Oscar Wilde",
      situationSlug: "estudios",
      quoteTypeSlug: "sarcastic",
      contentRating: "teen",
      sourceType: "book",
      sourceReference: "The Picture of Dorian Gray, Cap. 4",
      verificationStatus: "manual_verified",
    },
    {
      text: "El problema de posponer estudio es que luego aparece con peor humor y menos tiempo.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "sarcastic",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Hay estudiantes que quieren método; otros prefieren la tradición de improvisar con cara seria.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "sarcastic",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Copiar apuntes muy bonitos sigue siendo una forma sofisticada de no ponerse a pensar.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "sarcastic",
      contentRating: "adult",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "El cerebro ama la claridad, pero la plataforma educativa insiste en sorprender.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "sarcastic",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // estudios × wise_advice ──────────────────────────────────────────────
    {
      text: "Quien se conoce a sí mismo tiene verdadera claridad.",
      authorName: "Lao-Tse",
      situationSlug: "estudios",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Tao Te Ching 33",
      verificationStatus: "manual_verified",
    },
    {
      text: "Antes de repetir por quinta vez, comprueba si estás entendiendo o solo recitando.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Alterna lectura, práctica y descanso corto; la memoria también necesita orden.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Si un tema te humilla, empieza por la pregunta más pequeña que puedas responder.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Lo aprendido mejora cuando explicas con palabras simples algo que ayer te parecía imposible.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // estudios × excuse (4 frases — Homer Simpson eliminado por duplicado con trabajo×sarcastic)
    {
      text: "No suspendí por no estudiar; hice una prueba de realismo con material incompleto.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "excuse",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Mi método no era caótico; era flexible hasta niveles académicamente preocupantes.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "excuse",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "No llegué tarde al temario: estaba dejando que mi curiosidad apareciera sola.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "excuse",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "No me faltó constancia; me sobró confianza en un milagro metodológico.",
      authorName: "QuoteMatic",
      situationSlug: "estudios",
      quoteTypeSlug: "excuse",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // ════════════════════════════════════════════════════════════════════════
    // ESTRÉS  (39 frases — 4 en estres×excuse por duplicado Oscar Wilde eliminado)
    // ════════════════════════════════════════════════════════════════════════

    // estres × stoic ──────────────────────────────────────────────────────
    {
      text: "La naturaleza pide cierta pena; la imaginación añade mucho más.",
      authorName: "Séneca",
      situationSlug: "estres",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Consolación a Marcia 7",
      verificationStatus: "manual_verified",
    },
    {
      text: "El estrés pierde fuerza cuando dejas de discutir con el hecho de que existe.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "No todo pensamiento urgente merece obediencia inmediata.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Respira, acota y sigue: la serenidad rara vez llega completa, pero sí por partes.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Cuando todo corre, el primer acto sabio puede ser bajar medio paso.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // estres × philosophical ──────────────────────────────────────────────
    {
      text: "Quien sabe que tiene bastante ya es rico.",
      authorName: "Lao-Tse",
      situationSlug: "estres",
      quoteTypeSlug: "philosophical",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Tao Te Ching 33",
      verificationStatus: "manual_verified",
    },
    {
      text: "El estrés suele gritar futuro; el cuerpo, en cambio, casi siempre vive en presente.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "philosophical",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Hay cansancios que no piden heroísmo, sino una forma más humana de medir el día.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "philosophical",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "A veces no te falta capacidad; te falta una pausa donde vuelva a caber.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "philosophical",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "La mente exhausta convierte cualquier detalle en filosofía apocalíptica.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "philosophical",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // estres × motivational ───────────────────────────────────────────────
    {
      text: "Hay que tener caos dentro de uno para dar a luz una estrella danzante.",
      authorName: "Friedrich Nietzsche",
      situationSlug: "estres",
      quoteTypeSlug: "motivational",
      contentRating: "teen",
      sourceType: "book",
      sourceReference: "Así habló Zaratustra, Prólogo 5",
      verificationStatus: "manual_verified",
    },
    {
      text: "No necesitas un día perfecto para recomenzar; necesitas un siguiente gesto aceptable.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Cuando parezca mucho, salva solo la próxima media hora.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Tu energía no es infinita, pero aún puede alcanzar para una acción honesta.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Haz pequeño el frente de batalla y verás que el día vuelve a ser transitable.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // estres × funny ──────────────────────────────────────────────────────
    {
      text: "Hazlo o no lo hagas, pero no lo intentes.",
      authorName: "Yoda",
      situationSlug: "estres",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "movie",
      sourceReference: "The Empire Strikes Back, Dagobah",
      verificationStatus: "pending",
    },
    {
      text: "Estoy gestionando el estrés con una técnica avanzada llamada mirar al techo un momento.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Mi paz mental estaba aquí hace un minuto; seguramente fue a por agua.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "No me estoy derrumbando: solo estoy cargando demasiadas pestañas internas.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "El problema no soy yo; es mi calendario actuando como si tuviera tres clones.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // estres × realistic ──────────────────────────────────────────────────
    {
      text: "No te afecta la cosa, sino el juicio que haces de ella.",
      authorName: "Marco Aurelio",
      situationSlug: "estres",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Meditaciones 8.47",
      verificationStatus: "manual_verified",
    },
    {
      text: "Si todo te parece urgente, probablemente toca ordenar y no correr más.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Dormir poco no es una personalidad; es un aviso.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Un día saturado a veces mejora antes con límites que con café.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "El estrés no siempre se resuelve; muchas veces primero se administra.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // estres × sarcastic ──────────────────────────────────────────────────
    {
      text: "La verdad rara vez es pura y nunca simple.",
      authorName: "Oscar Wilde",
      situationSlug: "estres",
      quoteTypeSlug: "sarcastic",
      contentRating: "teen",
      sourceType: "book",
      sourceReference: "The Importance of Being Earnest, Acto 1",
      verificationStatus: "manual_verified",
    },
    {
      text: "El estrés moderno incluye responder mensajes para demostrar que sigues vivo.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "sarcastic",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Dicen que pares un poco; normalmente lo dicen quienes acaban de añadirte otra tarea.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "sarcastic",
      contentRating: "adult",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "En teoría debo priorizar; en práctica, el caos ya hizo una lista antes que yo.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "sarcastic",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Mi agenda quiere equilibrio, pero hoy ha preferido contenido dramático.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "sarcastic",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // estres × wise_advice ────────────────────────────────────────────────
    {
      text: "No busques que las cosas sucedan como quieres; quiere las cosas como suceden.",
      authorName: "Epicteto",
      situationSlug: "estres",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Enquiridión 8",
      verificationStatus: "manual_verified",
    },
    {
      text: "Antes de reaccionar, nombra el problema con una frase corta y sin adornos.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Si el cuerpo pide pausa, no la negocies como si fuera un capricho menor.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Reduce estímulos, baja exigencias imposibles y recupera la siguiente decisión útil.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Lo urgente mejora un poco cuando tu voz interior deja de hablarte como enemigo.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // estres × excuse (4 frases — Oscar Wilde eliminado por duplicado con trabajo×excuse)
    {
      text: "No exploté; hice una liberación expresiva de carga acumulada.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "excuse",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "No fue ansiedad; fue mi sistema interno ejecutando demasiadas alertas a la vez.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "excuse",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "No cancelé planes, preservé recursos para no convertirme en una leyenda triste.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "excuse",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "No estoy evitando gente; estoy haciendo mantenimiento emocional preventivo.",
      authorName: "QuoteMatic",
      situationSlug: "estres",
      quoteTypeSlug: "excuse",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // ════════════════════════════════════════════════════════════════════════
    // DECISIONES DIFÍCILES  (38 frases — 4 en ×funny y 4 en ×excuse por duplicados)
    // ════════════════════════════════════════════════════════════════════════

    // decisiones-dificiles × stoic ────────────────────────────────────────
    {
      text: "Puedes ser invencible si no entras en combates que no depende de ti ganar.",
      authorName: "Epicteto",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Enquiridión 19",
      verificationStatus: "manual_verified",
    },
    {
      text: "En una decisión difícil, primero separa el miedo posible del deber presente.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "No toda duda exige más vueltas; algunas exigen carácter suficiente para cortar.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Cuando elegir duela, recuerda que no elegir también es una forma de elegir.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Si ambas opciones cuestan, escoge la que puedas sostener con más verdad.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // decisiones-dificiles × philosophical ────────────────────────────────
    {
      text: "Nadie sabe si la muerte no será el mayor de los bienes para el ser humano.",
      authorName: "Platón",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "philosophical",
      contentRating: "teen",
      sourceType: "book",
      sourceReference: "Apología 29a",
      verificationStatus: "manual_verified",
    },
    {
      text: "Las decisiones duras no siempre separan bien y mal; a veces separan dos costos distintos.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "philosophical",
      contentRating: "adult",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Elegir es aceptar una pérdida concreta para defender un sentido más alto.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "philosophical",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Hay caminos que solo muestran su lógica después de que renuncias al mapa perfecto.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "philosophical",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "La claridad moral a veces llega tarde, pero la responsabilidad siempre llega puntual.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "philosophical",
      contentRating: "adult",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // decisiones-dificiles × motivational ─────────────────────────────────
    {
      text: "Una larga obediencia en la misma dirección vuelve valioso un propósito.",
      authorName: "Friedrich Nietzsche",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "motivational",
      contentRating: "teen",
      sourceType: "book",
      sourceReference: "Más allá del bien y del mal, aforismo 188",
      verificationStatus: "manual_verified",
    },
    {
      text: "No esperes certeza total para moverte; muchas decisiones solo se aclaran caminando.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Si el camino es serio, que también lo sea tu compromiso con el siguiente paso.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "A veces la valentía no abre todas las puertas; solo te hace elegir una.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Tomar una decisión difícil rara vez se siente heroico; suele sentirse sobrio y correcto.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // decisiones-dificiles × funny (4 frases — Yoda eliminado por duplicado con estres×funny)
    {
      text: "Mi criterio no estaba roto; solo estaba negociando con cinco escenarios absurdos a la vez.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Cuando una decisión tiene demasiadas variables, suelo consultar a una tostada y respirar.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Quise hacer una lista de pros y contras, y acabé haciendo poesía inquieta.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Si elegir entre dos males fuera un deporte, ya tendría patrocinador.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "funny",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // decisiones-dificiles × realistic ────────────────────────────────────
    {
      text: "Haciendo actos justos nos hacemos justos.",
      authorName: "Aristóteles",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Ética nicomaquea 2.1",
      verificationStatus: "manual_verified",
    },
    {
      text: "Si una opción contradice tus valores y la otra solo incomoda tu ego, la cuenta es clara.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Elegir tarde también tiene costo, aunque llegue vestido de prudencia.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "No siempre hay opción perfecta; suele haber una más cara, otra más limpia y ya.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Si necesitas decidir, baja el ruido, escribe criterios y mira qué puedes sostener mañana.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // decisiones-dificiles × sarcastic ────────────────────────────────────
    {
      text: "Esperar lo inesperado muestra un intelecto modernísimo.",
      authorName: "Oscar Wilde",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "sarcastic",
      contentRating: "adult",
      sourceType: "book",
      sourceReference: "An Ideal Husband, Acto 3",
      verificationStatus: "manual_verified",
    },
    {
      text: "Una mala decisión tomada con mucha seguridad sigue siendo una mala decisión bien peinada.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "sarcastic",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Cuando todos dicen sigue tu corazón, suelen omitir la parte donde luego pagas la factura.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "sarcastic",
      contentRating: "adult",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Mi indecisión no es caos; es respeto excesivo por las consecuencias y nulo gusto por ellas.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "sarcastic",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Elegir rápido es admirable, salvo cuando el cerebro claramente sigue fuera de cobertura.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "sarcastic",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // decisiones-dificiles × wise_advice ──────────────────────────────────
    {
      text: "Todo lo que tenemos que decidir es qué hacer con el tiempo que se nos da.",
      authorName: "Gandalf",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "The Fellowship of the Ring, The Shadow of the Past",
      verificationStatus: "pending",
    },
    {
      text: "Si la decisión te encoge por dentro, escucha eso antes que la presión del entorno.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Anota el criterio, no solo la emoción: releerlo mañana puede salvarte de una impulsividad cara.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Busca una opción que te deje dormir mejor, no solo explicar mejor tu postura.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Cuando el dilema sea serio, consulta hechos, valores y límites; en ese orden.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },

    // decisiones-dificiles × excuse (4 frases — Oscar Wilde eliminado por duplicado con trabajo×excuse)
    {
      text: "No elegí mal; elegí con la información emocionalmente incompleta que tenía.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "excuse",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "Si tardé en decidir, fue por respeto al desastre potencial, no por falta de ganas.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "excuse",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "No fue cobardía; fue un estudio intensivo de consecuencias con pésimo horario.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "excuse",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
    {
      text: "No cambié de opinión otra vez; refiné mi estrategia ante nueva evidencia y nuevo terror.",
      authorName: "QuoteMatic",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "excuse",
      contentRating: "teen",
      sourceType: "original",
      sourceReference: "QuoteMatic Demo Seed",
      verificationStatus: "pending",
    },
  ];

  const quotes = quotesSeed.map((q) => {
    const author = authorByName.get(q.authorName);
    const situation = situationBySlug.get(q.situationSlug);
    const quoteType = quoteTypeBySlug.get(q.quoteTypeSlug);

    if (!author || !situation || !quoteType) {
      throw new Error(`Invalid seed reference: "${q.text}"`);
    }

    return {
      text: q.text,
      textNormalized: normalizeText(q.text),
      author,
      situation,
      quoteType,
      language: "es",
      contentRating: q.contentRating,
      sourceType: q.sourceType,
      sourceReference: q.sourceReference,
      verificationStatus: q.verificationStatus,
      isActive: true,
    };
  });

  await Quote.insertMany(quotes);

  // ── Cobertura ────────────────────────────────────────────────────────────
  const situationSlugs = [
    "trabajo",
    "estudios",
    "estres",
    "decisiones-dificiles",
  ] as const;

  const quoteTypeSlugs: QuoteTypeSlug[] = [
    "stoic",
    "philosophical",
    "motivational",
    "funny",
    "realistic",
    "sarcastic",
    "wise_advice",
    "excuse",
  ];

  const coverageMap = new Map<string, number>();
  for (const q of quotesSeed) {
    const key = `${q.situationSlug} × ${q.quoteTypeSlug}`;
    coverageMap.set(key, (coverageMap.get(key) ?? 0) + 1);
  }

  let coveredCount = 0;
  let minCount = Infinity;
  const underCovered: string[] = [];

  for (const sit of situationSlugs) {
    for (const qt of quoteTypeSlugs) {
      const key = `${sit} × ${qt}`;
      const count = coverageMap.get(key) ?? 0;
      if (count < minCount) minCount = count;
      if (count >= 2) coveredCount++;
      else underCovered.push(`  ${key}: ${count}`);
    }
  }

  console.log("Seed completed successfully");
  console.log(`Authors:    ${authors.length}`);
  console.log(`Situations: ${situations.length}`);
  console.log(`QuoteTypes: ${quoteTypes.length}`);
  console.log(`Quotes:     ${quotes.length}`);
  console.log(`Combinaciones cubiertas (≥2): ${coveredCount} / 32`);
  console.log(`Mínimo de frases por combinación: ${minCount}`);

  if (underCovered.length > 0) {
    console.log("Combinaciones con menos de 2 frases:");
    underCovered.forEach((c) => console.log(c));
  } else {
    console.log("Todas las combinaciones tienen al menos 2 frases. ✓");
  }
};

runSeed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  });
