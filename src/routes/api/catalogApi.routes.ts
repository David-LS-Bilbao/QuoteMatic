import { Router } from "express";

import {
  getAuthors,
  getSituations,
  getQuoteTypes,
} from "../../controllers/api/catalogApi.controller";

const router = Router();

router.get("/authors", getAuthors);
router.get("/situations", getSituations);
router.get("/quote-types", getQuoteTypes);

export default router;
