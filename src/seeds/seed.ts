import dotenv from "dotenv";
import mongoose from "mongoose";

import { Author } from "../models/Author";
import { Favorite } from "../models/Favorite";
import { Quote } from "../models/Quote";
import { QuoteType } from "../models/QuoteType";
import { Situation } from "../models/Situation";


/*
este archivo se usa para crear la base de datos con los datos iniciales 
para cargar el catalogo de frases. 
*/


import type {
  ContentRating,
  QuoteTypeSlug,
  SourceType,
  VerificationStatus,
} from "../types/domain.types";

dotenv.config();

// Tipo intermedio para escribir las frases con datos faciles de leer.
// Estructura usada solo por el seed antes de convertir referencias legibles
// (nombre de autor y slugs) en ObjectIds de MongoDB.
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

// Mantiene los campos normalizados alineados con la búsqueda de la app:
// texto en minúsculas, sin espacios sobrantes y sin tildes.
const normalizeText = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const connectSeedDatabase = async (): Promise<void> => {
  // El seed usa la misma variable de entorno que la app para apuntar a local,
  // staging u otra instancia de MongoDB configurada.
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined. Seed aborted.");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected for seed");
};

const runSeed = async (): Promise<void> => {
  // Primero se abre la conexion porque todas las operaciones siguientes
  // escriben directamente en MongoDB.
  await connectSeedDatabase();

  console.log("Cleaning previous seed data...");

  // Favorites depende de las frases, por eso se elimina primero antes de
  // reconstruir el resto del catálogo desde cero.
  await Favorite.deleteMany({});
  await Quote.deleteMany({});
  await Author.deleteMany({});
  await Situation.deleteMany({});
  await QuoteType.deleteMany({});

  console.log("Creating authors...");

  // Catalogo inicial de autores disponibles para relacionar con frases.
  const authors = await Author.insertMany([
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
      sourceWork: "Cartas a Lucilio",
      verificationStatus: "pending",
      isVerified: false,
      isActive: true,
    },
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
    {
      name: "Albert Camus",
      normalizedName: normalizeText("Albert Camus"),
      authorType: "historical",
      sourceType: "book",
      sourceWork: "El mito de Sísifo",
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
  ]);

  // Estos mapas permiten mantener el seed de frases legible y, aun así,
  // insertar los ObjectIds de relación que necesita el modelo Quote.
  const authorByName = new Map(
    authors.map((author) => [author.name, author._id])
  );

  console.log("Creating situations...");

  // Situaciones o contextos que luego se usaran para consultar/recomendar frases.
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

  // Las situaciones se localizan por slug porque son claves estables para la API.
  const situationBySlug = new Map(
    situations.map((situation) => [situation.slug, situation._id])
  );

  console.log("Creating quote types...");

  // Tipos de frase del MVP. El slug es tecnico y estable; el name es visible.
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

  // Los tipos de frase también se indexan por slug para coincidir con el enum de dominio.
  const quoteTypeBySlug = new Map(
    quoteTypes.map((quoteType) => [quoteType.slug, quoteType._id])
  );

  console.log("Creating quotes...");

  // Frases iniciales escritas con referencias humanas para que el seed sea
  // facil de mantener durante el bootcamp.
  const quotesSeed: QuoteSeedItem[] = [
    {
      text: "Tienes poder sobre tu mente, no sobre los acontecimientos externos.",
      authorName: "Marco Aurelio",
      situationSlug: "estres",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Meditaciones",
      verificationStatus: "pending",
    },
    {
      text: "La felicidad de tu vida depende de la calidad de tus pensamientos.",
      authorName: "Marco Aurelio",
      situationSlug: "estudios",
      quoteTypeSlug: "philosophical",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Meditaciones",
      verificationStatus: "pending",
    },
    {
      text: "El impedimento a la acción avanza la acción; lo que se interpone en el camino se convierte en el camino.",
      authorName: "Marco Aurelio",
      situationSlug: "trabajo",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Meditaciones",
      verificationStatus: "pending",
    },
    {
      text: "No nos atrevemos a muchas cosas porque son difíciles, pero son difíciles porque no nos atrevemos a hacerlas.",
      authorName: "Séneca",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Cartas a Lucilio",
      verificationStatus: "pending",
    },
    {
      text: "Ningún viento es favorable para quien no sabe a qué puerto se dirige.",
      authorName: "Séneca",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Atribuida a Séneca",
      verificationStatus: "pending",
    },
    {
      text: "Mientras vivimos, aprendamos a vivir.",
      authorName: "Séneca",
      situationSlug: "estudios",
      quoteTypeSlug: "philosophical",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Atribuida a Séneca",
      verificationStatus: "pending",
    },
    {
      text: "Hazlo o no lo hagas, pero no lo intentes.",
      authorName: "Yoda",
      situationSlug: "trabajo",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "movie",
      sourceReference: "Star Wars: El Imperio contraataca",
      verificationStatus: "pending",
    },
    {
      text: "El miedo es el camino hacia el lado oscuro.",
      authorName: "Yoda",
      situationSlug: "estres",
      quoteTypeSlug: "wise_advice",
      contentRating: "teen",
      sourceType: "movie",
      sourceReference: "Star Wars: La amenaza fantasma",
      verificationStatus: "pending",
    },
    {
      text: "Entrénate para dejar ir todo aquello que temes perder.",
      authorName: "Yoda",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "philosophical",
      contentRating: "teen",
      sourceType: "movie",
      sourceReference: "Star Wars",
      verificationStatus: "pending",
    },
    {
      text: "Intentarlo es el primer paso hacia el fracaso.",
      authorName: "Homer Simpson",
      situationSlug: "estudios",
      quoteTypeSlug: "sarcastic",
      contentRating: "adult",
      sourceType: "tv_show",
      sourceReference: "The Simpsons",
      verificationStatus: "pending",
    },
    {
      text: "Si algo es difícil de hacer, entonces no merece la pena hacerlo.",
      authorName: "Homer Simpson",
      situationSlug: "trabajo",
      quoteTypeSlug: "excuse",
      contentRating: "teen",
      sourceType: "tv_show",
      sourceReference: "The Simpsons",
      verificationStatus: "pending",
    },
    {
      text: "El alcohol: la causa y la solución de todos los problemas de la vida.",
      authorName: "Homer Simpson",
      situationSlug: "estres",
      quoteTypeSlug: "funny",
      contentRating: "adult",
      sourceType: "tv_show",
      sourceReference: "The Simpsons",
      verificationStatus: "pending",
    },
    // ── Epicteto ────────────────────────────────────────────────────────────
    {
      text: "De las cosas que existen, unas dependen de nosotros y otras no. De nosotros dependen la opinión, la motivación y el deseo.",
      authorName: "Epicteto",
      situationSlug: "estres",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Enquiridión, I",
      verificationStatus: "pending",
    },
    {
      text: "No busques que lo que sucede suceda como tú quieres, sino desea que las cosas sucedan como son, y serás feliz.",
      authorName: "Epicteto",
      situationSlug: "trabajo",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Enquiridión, VIII",
      verificationStatus: "pending",
    },
    {
      text: "La riqueza no consiste en poseer muchas cosas, sino en necesitar pocas.",
      authorName: "Epicteto",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "philosophical",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Enquiridión",
      verificationStatus: "pending",
    },
    // ── Friedrich Nietzsche ─────────────────────────────────────────────────
    {
      text: "Lo que no me mata, me hace más fuerte.",
      authorName: "Friedrich Nietzsche",
      situationSlug: "trabajo",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Götzen-Dämmerung, §8",
      verificationStatus: "pending",
    },
    {
      text: "Sin música, la vida sería un error.",
      authorName: "Friedrich Nietzsche",
      situationSlug: "estres",
      quoteTypeSlug: "philosophical",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Götzen-Dämmerung",
      verificationStatus: "pending",
    },
    {
      text: "Hay que llevar todavía caos dentro de sí para poder dar a luz una estrella que baile.",
      authorName: "Friedrich Nietzsche",
      situationSlug: "estres",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Así habló Zaratustra, Prólogo §5",
      verificationStatus: "pending",
    },
    {
      text: "El que tiene un porqué para vivir puede soportar casi cualquier cómo.",
      authorName: "Friedrich Nietzsche",
      situationSlug: "estudios",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Götzen-Dämmerung, Máximas y dardos",
      verificationStatus: "pending",
    },
    // ── Oscar Wilde ─────────────────────────────────────────────────────────
    {
      text: "Solo hay una cosa en el mundo peor que hablen de ti: que no hablen de ti.",
      authorName: "Oscar Wilde",
      situationSlug: "estres",
      quoteTypeSlug: "sarcastic",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "El retrato de Dorian Gray, Cap. 1",
      verificationStatus: "pending",
    },
    {
      text: "La única forma de librarse de una tentación es ceder ante ella.",
      authorName: "Oscar Wilde",
      situationSlug: "trabajo",
      quoteTypeSlug: "sarcastic",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "El retrato de Dorian Gray, Cap. 2",
      verificationStatus: "pending",
    },
    // ── Miguel de Cervantes ─────────────────────────────────────────────────
    {
      text: "El que lee mucho y anda mucho, ve mucho y sabe mucho.",
      authorName: "Miguel de Cervantes",
      situationSlug: "estudios",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Don Quijote de la Mancha, Parte II",
      verificationStatus: "pending",
    },
    {
      text: "La pluma es la lengua del alma.",
      authorName: "Miguel de Cervantes",
      situationSlug: "estudios",
      quoteTypeSlug: "philosophical",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Los trabajos de Persiles y Sigismunda",
      verificationStatus: "pending",
    },
    {
      text: "Pocas veces las segundas partes son tan buenas como las primeras.",
      authorName: "Miguel de Cervantes",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "realistic",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Don Quijote de la Mancha, Parte II",
      verificationStatus: "pending",
    },
    // ── Albert Camus ────────────────────────────────────────────────────────
    {
      text: "En medio del invierno, descubrí que había en mí un verano invencible.",
      authorName: "Albert Camus",
      situationSlug: "estres",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Retour à Tipasa, L'Été (1954)",
      verificationStatus: "pending",
    },
    {
      text: "Hay que imaginarse a Sísifo feliz.",
      authorName: "Albert Camus",
      situationSlug: "trabajo",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "El mito de Sísifo",
      verificationStatus: "pending",
    },
    // ── Gandalf ─────────────────────────────────────────────────────────────
    {
      text: "Lo único que tenemos que decidir es qué hacer con el tiempo que se nos da.",
      authorName: "Gandalf",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "movie",
      sourceReference: "El Señor de los Anillos: La Comunidad del Anillo",
      verificationStatus: "pending",
    },
    {
      text: "Un mago nunca llega tarde, ni pronto. Llega exactamente cuando se lo propone.",
      authorName: "Gandalf",
      situationSlug: "trabajo",
      quoteTypeSlug: "funny",
      contentRating: "all",
      sourceType: "movie",
      sourceReference: "El Señor de los Anillos: La Comunidad del Anillo",
      verificationStatus: "pending",
    },
    // ── Séneca (ampliación) ─────────────────────────────────────────────────
    {
      text: "Enseñando se aprende.",
      authorName: "Séneca",
      situationSlug: "estudios",
      quoteTypeSlug: "motivational",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Epístolas Morales, VII.8",
      verificationStatus: "pending",
    },
    {
      text: "La vida, si sabes aprovecharla, es suficientemente larga.",
      authorName: "Séneca",
      situationSlug: "trabajo",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "De brevitate vitae, I",
      verificationStatus: "pending",
    },
    {
      text: "No es pobre quien tiene poco, sino quien desea mucho.",
      authorName: "Séneca",
      situationSlug: "estres",
      quoteTypeSlug: "wise_advice",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Epístolas Morales, II.6",
      verificationStatus: "pending",
    },
    // ── Marco Aurelio (ampliación) ──────────────────────────────────────────
    {
      text: "La mejor venganza es no parecerse al enemigo.",
      authorName: "Marco Aurelio",
      situationSlug: "decisiones-dificiles",
      quoteTypeSlug: "stoic",
      contentRating: "all",
      sourceType: "book",
      sourceReference: "Meditaciones, VI.6",
      verificationStatus: "pending",
    },
  ];

  // Convierte las filas legibles del seed en documentos con referencias validadas.
  // Si algún nombre o slug no existe, falla antes de insertar datos parciales.
  const quotes = quotesSeed.map((quote) => {
    const author = authorByName.get(quote.authorName);
    const situation = situationBySlug.get(quote.situationSlug);
    const quoteType = quoteTypeBySlug.get(quote.quoteTypeSlug);

    if (!author || !situation || !quoteType) {
      throw new Error(`Invalid seed reference for quote: ${quote.text}`);
    }

    return {
      text: quote.text,
      textNormalized: normalizeText(quote.text),
      author,
      situation,
      quoteType,
      language: "es",
      contentRating: quote.contentRating,
      sourceType: quote.sourceType,
      sourceReference: quote.sourceReference,
      verificationStatus: quote.verificationStatus,
      isActive: true,
    };
  });

  // Inserta todas las frases ya transformadas a documentos validos de Mongoose.
  await Quote.insertMany(quotes);

  // Resumen final util para comprobar rapidamente que el seed cargo lo esperado.
  console.log("Seed completed successfully");
  console.log(`Authors: ${authors.length}`);
  console.log(`Situations: ${situations.length}`);
  console.log(`QuoteTypes: ${quoteTypes.length}`);
  console.log(`Quotes: ${quotes.length}`);
};

runSeed()
  .catch((error) => {
    // Si algo falla, se marca codigo de salida distinto de 0 para detectar el error
    // en terminal o en futuros procesos de CI.
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    // La conexion se cierra siempre, tanto si el seed termina bien como si falla.
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  });
