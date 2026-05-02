import { Router } from "express";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "../config/swagger";

const router = Router();

router.get("/api-docs.json", (_req, res) => {
  res.status(200).json(swaggerSpec);
});

router.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "QuoteMatic API Docs",
  })
);

export default router;
