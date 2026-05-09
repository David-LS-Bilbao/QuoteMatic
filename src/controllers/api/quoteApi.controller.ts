import { Request, Response } from "express";
import mongoose from "mongoose";

import { Quote } from "../../models/Quote";
import { QuoteType } from "../../models/QuoteType";
import { Author } from "../../models/Author";
import { Situation } from "../../models/Situation";
import {
  CONTENT_RATINGS,
  SOURCE_TYPES,
  VERIFICATION_STATUSES,
} from "../../types/domain.types";



// controlador de la api de frases 

// Configuracion reutilizable de populate para devolver las relaciones principales
// de cada frase sin exponer documentos completos innecesarios.
const quotePopulate = [
  { path: "author", model: Author, select: "name authorType sourceWork isActive" },
  { path: "situation", model: Situation, select: "name slug description isActive" },
  { path: "quoteType", model: QuoteType, select: "name slug description contentRating isActive" },
];

// funciones auxiliares
// Valida el formato del id antes de consultar MongoDB y evita errores de casting.
const isValidMongoId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

const isValidContentRating = (value: string): boolean => {
  return (CONTENT_RATINGS as readonly string[]).includes(value);
};  

// helper para validar que el valor de verificationStatus es uno de los permitidos antes de filtrar o guardar.


const isValidVerificationStatus = (value: string): boolean => {
  return (VERIFICATION_STATUSES as readonly string[]).includes(value);
};

const isValidSourceType = (value: string): boolean => {
  return (SOURCE_TYPES as readonly string[]).includes(value);
};

const normalizeText = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

// --- Helpers de filtros y paginación para GET /api/quotes ---

type ParseIntResult =
  | { value: number }
  | { error: string };

const parsePositiveIntegerParam = (
  raw: unknown,
  name: string,
  min: number,
  max: number,
  defaultValue: number
): ParseIntResult => {
  if (raw === undefined) return { value: defaultValue };
  if (typeof raw !== "string") return { error: `Invalid ${name}` };
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed) || parsed < min || parsed > max) {
    return { error: `${name} must be an integer between ${min} and ${max}` };
  }
  return { value: parsed };
};

type PaginationResult =
  | { page: number; limit: number }
  | { error: string };

const parsePagination = (query: Request["query"]): PaginationResult => {
  const pageResult = parsePositiveIntegerParam(query.page, "page", 1, 10_000, 1);
  if ("error" in pageResult) return pageResult;

  const limitResult = parsePositiveIntegerParam(query.limit, "limit", 1, 100, 20);
  if ("error" in limitResult) return limitResult;

  return { page: pageResult.value, limit: limitResult.value };
};

type SlugResolveResult =
  | { id: mongoose.Types.ObjectId }
  | { error: string; status: 400 | 404 };

const resolveSituationBySlug = async (slug: unknown): Promise<SlugResolveResult | null> => {
  if (slug === undefined) return null;
  if (typeof slug !== "string") return { error: "Invalid situation slug", status: 400 };
  const doc = await Situation.findOne({ slug, isActive: true }).select("_id");
  if (!doc) return { error: "Situation not found", status: 404 };
  return { id: doc._id as mongoose.Types.ObjectId };
};

const resolveQuoteTypeBySlug = async (slug: unknown): Promise<SlugResolveResult | null> => {
  if (slug === undefined) return null;
  if (typeof slug !== "string") return { error: "Invalid quoteType slug", status: 400 };
  const doc = await QuoteType.findOne({ slug, isActive: true }).select("_id");
  if (!doc) return { error: "Quote type not found", status: 404 };
  return { id: doc._id as mongoose.Types.ObjectId };
};

type AuthorFilterResult =
  | { id: mongoose.Types.ObjectId }
  | { error: string; status: 400 | 404 }
  | null;

const validateAuthorFilter = async (author: unknown): Promise<AuthorFilterResult> => {
  if (author === undefined) return null;
  if (typeof author !== "string" || !isValidMongoId(author)) {
    return { error: "Invalid author id", status: 400 };
  }
  const exists = await Author.exists({ _id: author, isActive: true });
  if (!exists) return { error: "Author not found", status: 404 };
  return { id: new mongoose.Types.ObjectId(author) };
};

// --- Fin helpers de filtros ---

const validateQuoteReferences = async (
  author?: unknown,
  situation?: unknown,
  quoteType?: unknown
): Promise<string | null> => {
  if (author !== undefined) {
    if (typeof author !== "string" || !isValidMongoId(author)) {
      return "Invalid author id";
    }

    const authorExists = await Author.exists({
      _id: author,
      isActive: true,
    });

    if (!authorExists) {
      return "Author not found";
    }
  }

  if (situation !== undefined) {
    if (typeof situation !== "string" || !isValidMongoId(situation)) {
      return "Invalid situation id";
    }

    const situationExists = await Situation.exists({
      _id: situation,
      isActive: true,
    });

    if (!situationExists) {
      return "Situation not found";
    }
  }

  if (quoteType !== undefined) {
    if (typeof quoteType !== "string" || !isValidMongoId(quoteType)) {
      return "Invalid quoteType id";
    }

    const quoteTypeExists = await QuoteType.exists({
      _id: quoteType,
      isActive: true,
    });

    if (!quoteTypeExists) {
      return "QuoteType not found";
    }
  }

  return null;
};





// Respuesta comun para errores inesperados de la API de frases.
const handleApiError = (error: unknown, res: Response): void => {
  console.error("Quote API error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export const getQuotes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pagination = parsePagination(req.query);
    if ("error" in pagination) {
      res.status(400).json({ success: false, message: pagination.error });
      return;
    }
    const { page, limit } = pagination;

    const filter: Record<string, unknown> = { isActive: true };

    const { contentRating, search } = req.query;

    if (contentRating !== undefined) {
      if (typeof contentRating !== "string" || !isValidContentRating(contentRating)) {
        res.status(400).json({
          success: false,
          message: "Invalid contentRating. Allowed values: all, teen, adult",
        });
        return;
      }
      filter.contentRating = contentRating;
    }

    const situationResult = await resolveSituationBySlug(req.query.situation);
    if (situationResult !== null && "error" in situationResult) {
      res.status(situationResult.status).json({ success: false, message: situationResult.error });
      return;
    }
    if (situationResult !== null) filter.situation = situationResult.id;

    const quoteTypeResult = await resolveQuoteTypeBySlug(req.query.quoteType);
    if (quoteTypeResult !== null && "error" in quoteTypeResult) {
      res.status(quoteTypeResult.status).json({ success: false, message: quoteTypeResult.error });
      return;
    }
    if (quoteTypeResult !== null) filter.quoteType = quoteTypeResult.id;

    const authorResult = await validateAuthorFilter(req.query.author);
    if (authorResult !== null && "error" in authorResult) {
      res.status(authorResult.status).json({ success: false, message: authorResult.error });
      return;
    }
    if (authorResult !== null) filter.author = authorResult.id;

    if (search !== undefined) {
      if (typeof search !== "string" || search.trim().length < 2 || search.trim().length > 100) {
        res.status(400).json({
          success: false,
          message: "search must be between 2 and 100 characters",
        });
        return;
      }
      const normalized = normalizeText(search);
      filter.textNormalized = { $regex: normalized, $options: "i" };
    }

    const [quotes, total] = await Promise.all([
      Quote.find(filter)
        .populate(quotePopulate)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Quote.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: quotes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    handleApiError(error, res);
  }
};

export const getRandomQuote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // La frase aleatoria tambien respeta el estado activo y filtros basicos.
    const filter: Record<string, unknown> = {
      isActive: true,
    };
const { contentRating } = req.query;

if (contentRating !== undefined) {
  if (
    typeof contentRating !== "string" ||
    !isValidContentRating(contentRating)
  ) {
    res.status(400).json({
      success: false,
      message: "Invalid contentRating. Allowed values: all, teen, adult",
    });
    return;
  }

  filter.contentRating = contentRating;
}

    // quoteType llega como slug tecnico; se resuelve a ObjectId antes de filtrar Quote.
    if (typeof req.query.quoteType === "string") {
      const quoteType = await QuoteType.findOne({
        slug: req.query.quoteType,
        isActive: true,
      });

      if (!quoteType) {
        res.status(404).json({
          success: false,
          message: "Quote type not found",
        });
        return;
      }

      filter.quoteType = quoteType._id;
    }

    // situation llega como slug; se resuelve a ObjectId antes de filtrar Quote.
    if (typeof req.query.situation === "string") {
      const situation = await Situation.findOne({
        slug: req.query.situation,
        isActive: true,
      });

      if (!situation) {
        res.status(404).json({
          success: false,
          message: "Situation not found",
        });
        return;
      }

      filter.situation = situation._id;
    }

    // Primero se cuenta el total para poder elegir una posicion aleatoria valida.
    const totalQuotes = await Quote.countDocuments(filter);

    if (totalQuotes === 0) {
      res.status(404).json({
        success: false,
        message: "No active quotes found",
      });
      return;
    }

    const randomSkip = Math.floor(Math.random() * totalQuotes);

    // skip permite saltar hasta la posicion aleatoria calculada sobre el filtro.
    const quote = await Quote.findOne(filter)
  .skip(randomSkip)
  .populate(quotePopulate);

if (!quote) {
  res.status(404).json({
    success: false,
    message: "No active quotes found",
  });
  return;
}

res.status(200).json({
  success: true,
  data: quote,
});

  } catch (error) {
    handleApiError(error, res);
  }};

export const getQuoteById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

  const id = req.params.id;

// Se valida el ObjectId antes de buscar para responder 400 si el parametro no es valido.
if (typeof id !== "string" || !isValidMongoId(id)) {
  res.status(400).json({
    success: false,
    message: "Invalid quote id",
  });
  return;
}

    // Se busca solo entre frases activas para mantener la desactivacion logica.
    const quote = await Quote.findOne({
      _id: id,
      isActive: true,
    }).populate(quotePopulate);

    if (!quote) {
      res.status(404).json({
        success: false,
        message: "Quote not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: quote,
    });
  } catch (error) {
    handleApiError(error, res);
  }
};


// Valida el formato del id antes de consultar MongoDB y evita errores de casting. 

export const createQuote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      text,
      author,
      situation,
      quoteType,
      language,
      contentRating,
      verificationStatus,
      sourceType = "unknown",
      sourceReference,
    } = req.body;

    if (
      typeof text !== "string" ||
      !text.trim() ||
      typeof author !== "string" ||
      typeof situation !== "string" ||
      typeof quoteType !== "string" ||
      typeof language !== "string" ||
      typeof contentRating !== "string" ||
      typeof verificationStatus !== "string"
    ) {
      res.status(400).json({
        success: false,
        message:
          "Required fields: text, author, situation, quoteType, language, contentRating, verificationStatus",
      });
      return;
    }

    if (!isValidContentRating(contentRating)) {
      res.status(400).json({
        success: false,
        message: "Invalid contentRating. Allowed values: all, teen, adult",
      });
      return;
    }

    if (!isValidVerificationStatus(verificationStatus)) {
      res.status(400).json({
        success: false,
        message:
          "Invalid verificationStatus. Allowed values: original, pending, manual_verified, rejected, disputed",
      });
      return;
    }

    if (typeof sourceType !== "string" || !isValidSourceType(sourceType)) {
      res.status(400).json({
        success: false,
        message:
          "Invalid sourceType. Allowed values: book, movie, tv_show, historical, original, unknown",
      });
      return;
    }

    const referenceError = await validateQuoteReferences(
      author,
      situation,
      quoteType
    );

    if (referenceError) {
      res.status(400).json({
        success: false,
        message: referenceError,
      });
      return;
    }

    const quote = await Quote.create({
      text,
      textNormalized: normalizeText(text),
      author,
      situation,
      quoteType,
      language,
      contentRating,
      sourceType,
      sourceReference,
      verificationStatus,
      isActive: true,
    });

    const createdQuote = await Quote.findById(quote._id).populate(quotePopulate);

    res.status(201).json({
      success: true,
      data: createdQuote,
    });
  } catch (error) {
    handleApiError(error, res);
  }
};

export const updateQuote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !isValidMongoId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid quote id",
      });
      return;
    }

    const quoteExists = await Quote.exists({ _id: id, isActive: true });

    if (!quoteExists) {
      res.status(404).json({
        success: false,
        message: "Quote not found",
      });
      return;
    }

    const { author, situation, quoteType } = req.body;

    const referenceError = await validateQuoteReferences(
      author,
      situation,
      quoteType
    );

    if (referenceError) {
      res.status(400).json({
        success: false,
        message: referenceError,
      });
      return;
    }

    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      "author",
      "situation",
      "quoteType",
      "language",
      "contentRating",
      "sourceType",
      "sourceReference",
      "verificationStatus",
    ];

    if (req.body.text !== undefined) {
      if (typeof req.body.text !== "string" || !req.body.text.trim()) {
        res.status(400).json({
          success: false,
          message: "Invalid text",
        });
        return;
      }

      updateData.text = req.body.text;
      updateData.textNormalized = normalizeText(req.body.text);
    }

    if (req.body.contentRating !== undefined) {
      if (
        typeof req.body.contentRating !== "string" ||
        !isValidContentRating(req.body.contentRating)
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid contentRating. Allowed values: all, teen, adult",
        });
        return;
      }
    }

    if (req.body.verificationStatus !== undefined) {
      if (
        typeof req.body.verificationStatus !== "string" ||
        !isValidVerificationStatus(req.body.verificationStatus)
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid verificationStatus. Allowed values: original, pending, manual_verified, rejected, disputed",
        });
        return;
      }
    }

    if (req.body.sourceType !== undefined) {
      if (
        typeof req.body.sourceType !== "string" ||
        !isValidSourceType(req.body.sourceType)
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid sourceType. Allowed values: book, movie, tv_show, historical, original, unknown",
        });
        return;
      }
    }

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const updatedQuote = await Quote.findOneAndUpdate(
      { _id: id, isActive: true },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate(quotePopulate);

    res.status(200).json({
      success: true,
      data: updatedQuote,
    });
  } catch (error) {
    handleApiError(error, res);
  }
};


export const deleteQuote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !isValidMongoId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid quote id",
      });
      return;
    }

    const deletedQuote = await Quote.findByIdAndUpdate(
      id,
      { isActive: false },
      {
        new: true,
        runValidators: true,
      }
    ).populate(quotePopulate);

    if (!deletedQuote) {
      res.status(404).json({
        success: false,
        message: "Quote not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: deletedQuote,
    });
  } catch (error) {
    handleApiError(error, res);
  }
};



