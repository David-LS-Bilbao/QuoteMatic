import { Router } from "express";

import {
  createMyUserQuote,
  deleteMyUserQuote,
  getMyUserQuoteById,
  getMyUserQuotes,
  getRandomMyUserQuote,
  updateMyUserQuote,
} from "../../controllers/api/userQuoteApi.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", isAuthenticated, getMyUserQuotes);

// /random debe declararse antes de /:id para que Express no la interprete como parámetro.
router.get("/random", isAuthenticated, getRandomMyUserQuote);

router.get("/:id", isAuthenticated, getMyUserQuoteById);

router.post("/", isAuthenticated, createMyUserQuote);

router.put("/:id", isAuthenticated, updateMyUserQuote);

router.delete("/:id", isAuthenticated, deleteMyUserQuote);

export default router;
