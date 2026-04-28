import { Router } from "express";

import { renderHome } from "../controllers/home.controller";

const router = Router();

router.get("/", renderHome);

export default router;