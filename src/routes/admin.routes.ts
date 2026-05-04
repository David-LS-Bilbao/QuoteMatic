import { Router } from "express";

import {
  createAdminAuthor,
  deleteAdminAuthor,
  editAdminAuthorForm,
  listAdminAuthors,
  listAuthorQuotes,
  newAdminAuthorForm,
  updateAdminAuthor,
} from "../controllers/web/adminAuthor.controller";
import {
  createAdminQuote,
  deleteAdminQuote,
  editAdminQuoteForm,
  listAdminQuotes,
  newAdminQuoteForm,
  updateAdminQuote,
} from "../controllers/web/adminQuote.controller";
import { requireWebAdmin } from "../middlewares/webAdmin.middleware";

const router = Router();

router.use(requireWebAdmin);

// Quotes
router.get("/quotes", listAdminQuotes);
router.get("/quotes/new", newAdminQuoteForm);
router.post("/quotes", createAdminQuote);
router.get("/quotes/:id/edit", editAdminQuoteForm);
router.post("/quotes/:id/update", updateAdminQuote);
router.post("/quotes/:id/delete", deleteAdminQuote);

// Authors
router.get("/authors", listAdminAuthors);
router.get("/authors/new", newAdminAuthorForm);
router.post("/authors", createAdminAuthor);
router.get("/authors/:id/quotes", listAuthorQuotes);
router.get("/authors/:id/edit", editAdminAuthorForm);
router.post("/authors/:id/update", updateAdminAuthor);
router.post("/authors/:id/delete", deleteAdminAuthor);

export default router;
