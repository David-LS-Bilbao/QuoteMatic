import { Router } from "express";

import {
  addFavorite,
  getMyFavorites,
  removeFavorite,
} from "../../controllers/api/favoriteApi.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const router = Router();

// Lista los favoritos activos del usuario autenticado.
router.get("/me", isAuthenticated, getMyFavorites);

// Guarda una frase como favorita para el usuario autenticado.
router.post("/:quoteId", isAuthenticated, addFavorite);

// Quita una frase de favoritos mediante borrado lógico.
router.delete("/:quoteId", isAuthenticated, removeFavorite);

export default router;

/*
Separa rutas de controller.
Protege todos los endpoints con isAuthenticated.
Mantiene MVC simple.
*/