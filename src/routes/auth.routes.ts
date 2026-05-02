import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";


import {
  login,
  logout,
  adminCheck,
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

router.get("/admin-check", isAuthenticated, isAdmin, adminCheck);

router.get("/me", isAuthenticated, me);

export default router;