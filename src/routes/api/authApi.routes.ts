import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/role.middleware";
import {
  apiRegister,
  apiLogin,
  apiLogout,
  apiMe,
  apiAdminCheck,
} from "../../controllers/api/authApi.controller";

const router = Router();

router.post("/register", apiRegister);
router.post("/login", apiLogin);
router.post("/logout", isAuthenticated, apiLogout);
router.get("/me", apiMe);
router.get("/admin-check", isAuthenticated, isAdmin, apiAdminCheck);

export default router;
