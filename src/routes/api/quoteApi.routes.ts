import { Router } from "express";

import {
  createQuote,
  deleteQuote,
  getQuoteById,
  getQuotes,
  getRandomQuote,
  updateQuote,
} from "../../controllers/api/quoteApi.controller";
import { bulkCreateQuotes } from "../../controllers/api/quoteBulkApi.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/role.middleware";

const router = Router();

// Lista todas las frases disponibles para la API publica.
router.get("/", getQuotes);

// Esta ruta debe declararse antes de "/:id" para que "random" no se interprete
// como un parametro dinamico de id.
router.get("/random", getRandomQuote);

// Devuelve una frase concreta por su ObjectId de MongoDB.
router.get("/:id", getQuoteById);

// Crea una nueva frase. Solo usuarios admin autenticados.
router.post("/", isAuthenticated, isAdmin, createQuote);

// Importacion masiva de frases via JSON. Solo admin. Debe declararse antes de /:id.
router.post("/bulk", isAuthenticated, isAdmin, bulkCreateQuotes);

// Actualiza una frase existente. Solo usuarios admin autenticados.
router.put("/:id", isAuthenticated, isAdmin, updateQuote);

// Elimina una frase mediante borrado lógico. Solo usuarios admin autenticados.
router.delete("/:id", isAuthenticated, isAdmin, deleteQuote);

export default router;

/*
Separa rutas de controller.
Protege todos los endpoints con isAuthenticated.
Mantiene MVC simple.
*/