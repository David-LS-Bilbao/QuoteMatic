import { Router } from "express";

import {
  login,
  logout,
  me,
  register,
  showLoginForm,
  showRegisterForm,
} from "../controllers/auth.controller";

const router = Router();

router.get("/register", showRegisterForm);
router.post("/register", register);

router.get("/login", showLoginForm);
router.post("/login", login);

router.post("/logout", logout);

router.get("/me", me);

export default router;