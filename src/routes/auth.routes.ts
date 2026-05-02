import { Router } from "express";

import {
  register,
  showRegisterForm,
} from "../controllers/auth.controller";

const router = Router();

router.get("/register", showRegisterForm);
router.post("/register", register);

export default router;
