import { Router } from "express";

import {
  getQuoteById,
  getQuotes,
  getRandomQuote,
} from "../../controllers/api/quoteApi.controller";

const router = Router();

// Lista todas las frases disponibles para la API publica.
router.get("/", getQuotes);

// Esta ruta debe declararse antes de "/:id" para que "random" no se interprete
// como un parametro dinamico de id.
router.get("/random", getRandomQuote);

// Devuelve una frase concreta por su ObjectId de MongoDB.
router.get("/:id", getQuoteById);

export default router;
