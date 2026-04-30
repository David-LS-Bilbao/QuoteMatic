import { Request, Response } from "express";
import mongoose from "mongoose";

import { Quote } from "../../models/Quote";
import { QuoteType } from "../../models/QuoteType";
import { Author } from "../../models/Author";
import { Situation } from "../../models/Situation";
import { CONTENT_RATINGS } from "../../types/domain.types";



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
    // Por defecto la API publica solo devuelve frases activas.
    const filter: Record<string, unknown> = {
      isActive: true,
    };

    // Filtro opcional para probar la clasificacion de contenido desde query params.
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

    // Se ordena de mas reciente a mas antigua para una respuesta predecible.
    const quotes = await Quote.find(filter)
      .populate(quotePopulate)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: quotes,
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
