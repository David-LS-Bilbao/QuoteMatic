import { Router } from "express";

import {
  createQuote,
  deleteQuote,
  getQuoteById,
  getQuotes,
  getRandomQuote,
  updateQuote,
} from "../../controllers/api/quoteApi.controller";

const router = Router();

// Lista todas las frases disponibles para la API publica.
router.get("/", getQuotes);

// Esta ruta debe declararse antes de "/:id" para que "random" no se interprete
// como un parametro dinamico de id.
router.get("/random", getRandomQuote);

// Devuelve una frase concreta por su ObjectId de MongoDB.
router.get("/:id", getQuoteById);

// Crea una nueva frase a partir de los datos enviados en el cuerpo de la solicitud.
router.post("/", createQuote);

// Actualiza una frase existente identificada por su ObjectId de MongoDB.
router.put("/:id", updateQuote);

// Elimina una frase concreta por su ObjectId de MongoDB.
router.delete("/:id", deleteQuote);

export default router;
