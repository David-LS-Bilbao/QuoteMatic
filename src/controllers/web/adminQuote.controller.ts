import { Request, Response } from "express";
import mongoose from "mongoose";

import { Author } from "../../models/Author";
import { Quote } from "../../models/Quote";
import { QuoteType } from "../../models/QuoteType";
import { Situation } from "../../models/Situation";
import {
  CONTENT_RATINGS,
  SOURCE_TYPES,
  VERIFICATION_STATUSES,
  type AuthorType,
  type ContentRating,
  type SourceType,
  type VerificationStatus,
} from "../../types/domain.types";

const quotePopulate = [
  { path: "author", model: Author, select: "name authorType isActive" },
  { path: "situation", model: Situation, select: "name slug isActive" },
  { path: "quoteType", model: QuoteType, select: "name slug isActive" },
];

const normalizeText = (value: string): string =>
  value.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const isValidMongoId = (id: string): boolean =>
  mongoose.Types.ObjectId.isValid(id);

const getUser = (req: Request) => ({
  isAuthenticated: true,
  role: req.session.role ?? null,
  ageGroup: req.session.ageGroup ?? null,
});

const loadFormCatalogs = async () => {
  const [situations, quoteTypes] = await Promise.all([
    Situation.find({ isActive: true }).sort({ name: 1 }).lean(),
    QuoteType.find({ isActive: true }).sort({ name: 1 }).lean(),
  ]);
  return { situations, quoteTypes };
};

// Finds an existing Author by normalizedName or creates one with safe defaults.
const findOrCreateAuthorByName = async (
  name: string
): Promise<mongoose.Types.ObjectId> => {
  const normalized = normalizeText(name);
  const existing = await Author.findOne({ normalizedName: normalized });
  if (existing) return existing._id as mongoose.Types.ObjectId;

  const created = await Author.create({
    name: name.trim(),
    normalizedName: normalized,
    authorType: "unknown" as AuthorType,
    sourceType: "unknown" as SourceType,
    verificationStatus: "pending" as VerificationStatus,
    isVerified: false,
    isActive: true,
  });
  return created._id as mongoose.Types.ObjectId;
};

export const listAdminQuotes = async (req: Request, res: Response): Promise<void> => {
  const quotes = await Quote.find()
    .populate(quotePopulate)
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  res.render("admin/quotes", {
    title: "Frases | Admin | QuoteMatic",
    quotes,
    msg: req.query.msg ?? null,
    user: getUser(req),
  });
};

export const newAdminQuoteForm = async (req: Request, res: Response): Promise<void> => {
  const catalogs = await loadFormCatalogs();

  res.render("admin/quote-form", {
    title: "Nueva frase | Admin | QuoteMatic",
    quote: null,
    ...catalogs,
    contentRatings: CONTENT_RATINGS,
    verificationStatuses: VERIFICATION_STATUSES,
    sourceTypes: SOURCE_TYPES,
    error: null,
    user: getUser(req),
  });
};

export const createAdminQuote = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as Record<string, string>;
  const { text, author, situation, quoteType, language, contentRating, verificationStatus, sourceType, sourceReference } = body;

  const renderError = async (error: string): Promise<void> => {
    const catalogs = await loadFormCatalogs();
    res.status(400).render("admin/quote-form", {
      title: "Nueva frase | Admin | QuoteMatic",
      quote: body,
      ...catalogs,
      contentRatings: CONTENT_RATINGS,
      verificationStatuses: VERIFICATION_STATUSES,
      sourceTypes: SOURCE_TYPES,
      error,
      user: getUser(req),
    });
  };

  if (!text?.trim() || !author?.trim() || !situation || !quoteType || !contentRating || !verificationStatus) {
    await renderError("Todos los campos obligatorios deben estar rellenos.");
    return;
  }

  if (!isValidMongoId(situation) || !isValidMongoId(quoteType)) {
    await renderError("Situación o tipo de frase no válidos.");
    return;
  }

  if (!(CONTENT_RATINGS as readonly string[]).includes(contentRating)) {
    await renderError("Clasificación de contenido no válida.");
    return;
  }

  try {
    const authorId = await findOrCreateAuthorByName(author.trim());
    const textNormalized = normalizeText(text);

    const alreadyExists = await Quote.exists({ textNormalized, author: authorId });
    if (alreadyExists) {
      await renderError("Esta frase ya existe para ese autor en QuoteMatic.");
      return;
    }

    await Quote.create({
      text: text.trim(),
      textNormalized,
      author: authorId,
      situation,
      quoteType,
      language: language?.trim() || "es",
      contentRating: contentRating as ContentRating,
      sourceType: (sourceType as SourceType) || "unknown",
      sourceReference: sourceReference?.trim() || undefined,
      verificationStatus: (verificationStatus as VerificationStatus) || "pending",
      isActive: true,
    });

    res.redirect("/admin/quotes?msg=Frase+creada+correctamente.");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al crear la frase.";
    await renderError(message);
  }
};

export const editAdminQuoteForm = async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);

  if (!isValidMongoId(id)) {
    res.redirect("/admin/quotes");
    return;
  }

  const [quote, catalogs] = await Promise.all([
    Quote.findById(id).populate(quotePopulate).lean(),
    loadFormCatalogs(),
  ]);

  if (!quote) {
    res.redirect("/admin/quotes");
    return;
  }

  res.render("admin/quote-form", {
    title: "Editar frase | Admin | QuoteMatic",
    quote,
    ...catalogs,
    contentRatings: CONTENT_RATINGS,
    verificationStatuses: VERIFICATION_STATUSES,
    sourceTypes: SOURCE_TYPES,
    error: null,
    user: getUser(req),
  });
};

export const updateAdminQuote = async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);

  if (!isValidMongoId(id)) {
    res.redirect("/admin/quotes");
    return;
  }

  const body = req.body as Record<string, string>;
  const { text, author, situation, quoteType, language, contentRating, verificationStatus, sourceType, sourceReference } = body;

  const renderError = async (error: string): Promise<void> => {
    const [originalQuote, catalogs] = await Promise.all([
      Quote.findById(id).lean(),
      loadFormCatalogs(),
    ]);
    res.status(400).render("admin/quote-form", {
      title: "Editar frase | Admin | QuoteMatic",
      quote: { ...originalQuote, ...body, _id: id },
      ...catalogs,
      contentRatings: CONTENT_RATINGS,
      verificationStatuses: VERIFICATION_STATUSES,
      sourceTypes: SOURCE_TYPES,
      error,
      user: getUser(req),
    });
  };

  if (!text?.trim()) {
    await renderError("El texto de la frase es obligatorio.");
    return;
  }

  try {
    const update: Record<string, unknown> = {
      text: text.trim(),
      textNormalized: normalizeText(text),
    };

    if (author?.trim()) update.author = await findOrCreateAuthorByName(author.trim());
    if (situation && isValidMongoId(situation)) update.situation = situation;
    if (quoteType && isValidMongoId(quoteType)) update.quoteType = quoteType;
    if (language?.trim()) update.language = language.trim();
    if (contentRating && (CONTENT_RATINGS as readonly string[]).includes(contentRating)) {
      update.contentRating = contentRating;
    }
    if (verificationStatus && (VERIFICATION_STATUSES as readonly string[]).includes(verificationStatus)) {
      update.verificationStatus = verificationStatus;
    }
    if (sourceType && (SOURCE_TYPES as readonly string[]).includes(sourceType)) {
      update.sourceType = sourceType;
    }
    update.sourceReference = sourceReference?.trim() || undefined;

    await Quote.findByIdAndUpdate(id, update, { runValidators: true });
    res.redirect("/admin/quotes?msg=Frase+actualizada+correctamente.");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al actualizar la frase.";
    await renderError(message);
  }
};

export const deleteAdminQuote = async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);

  if (isValidMongoId(id)) {
    await Quote.findByIdAndUpdate(id, { isActive: false });
  }

  res.redirect("/admin/quotes?msg=Frase+desactivada.");
};
