import { Router } from "express";

import {
  createAdminAuthor,
  deleteAdminAuthor,
  editAdminAuthorForm,
  listAdminAuthors,
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
import {
  renderImportPage,
  searchQuotableAuthors,
  getAuthorQuotes,
  saveSelectedQuotes,
} from "../controllers/web/adminImport.controller";
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
router.get("/authors/:id/edit", editAdminAuthorForm);
router.post("/authors/:id/update", updateAdminAuthor);
router.post("/authors/:id/delete", deleteAdminAuthor);

// Import — flujo Quotable de 3 pasos
router.get("/import", renderImportPage);
router.post("/import/search", searchQuotableAuthors);
router.get("/import/quotes/:slug", getAuthorQuotes);
router.post("/import/quotes", saveSelectedQuotes);

export default router;
