import { Router } from "express";

import { renderAdminPage } from "../controllers/web/adminPage.controller";
import { renderDashboard } from "../controllers/web/dashboard.controller";
import { renderFavoritesPage } from "../controllers/web/favoritesPage.controller";

const router = Router();

router.get("/dashboard", renderDashboard);
router.get("/favorites", renderFavoritesPage);
router.get("/admin", renderAdminPage);

export default router;
