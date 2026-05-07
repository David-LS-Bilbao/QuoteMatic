import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../../models/User";
import { AGE_GROUPS, type AgeGroup } from "../../types/domain.types";

const SALT_ROUNDS = 10;

type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
  ageRange?: string;
};

type LoginBody = {
  email?: string;
  password?: string;
};

const isValidAgeGroup = (value: string): value is AgeGroup =>
  (AGE_GROUPS as readonly string[]).includes(value);

export const apiRegister = async (
  req: Request<unknown, unknown, RegisterBody>,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, ageRange } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password.trim() ||
      typeof ageRange !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios.",
        error: { code: "MISSING_FIELDS" },
      });
      return;
    }

    if (ageRange === "under_14") {
      res.status(403).json({
        success: false,
        message: "No se permite el registro a menores de 14 años.",
        error: { code: "AGE_RESTRICTED" },
      });
      return;
    }

    if (!isValidAgeGroup(ageRange)) {
      res.status(400).json({
        success: false,
        message: "Rango de edad no válido.",
        error: { code: "INVALID_AGE_GROUP" },
      });
      return;
    }

    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "Ya existe un usuario con ese email.",
        error: { code: "EMAIL_TAKEN" },
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      ageGroup: ageRange,
    });

    req.session.userId = user._id.toString();
    req.session.role = user.role;
    req.session.ageGroup = user.ageGroup;

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          role: user.role,
          ageGroup: user.ageGroup,
        },
      },
    });
  } catch (error) {
    console.error("apiRegister error:", error);
    res.status(500).json({
      success: false,
      message: "Error interno al registrar usuario.",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const apiLogin = async (
  req: Request<unknown, unknown, LoginBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Email y contraseña son obligatorios.",
        error: { code: "MISSING_FIELDS" },
      });
      return;
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Email o contraseña incorrectos.",
        error: { code: "INVALID_CREDENTIALS" },
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: "Usuario inactivo.",
        error: { code: "USER_INACTIVE" },
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Email o contraseña incorrectos.",
        error: { code: "INVALID_CREDENTIALS" },
      });
      return;
    }

    req.session.userId = user._id.toString();
    req.session.role = user.role;
    req.session.ageGroup = user.ageGroup;

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          role: user.role,
          ageGroup: user.ageGroup,
        },
      },
    });
  } catch (error) {
    console.error("apiLogin error:", error);
    res.status(500).json({
      success: false,
      message: "Error interno al iniciar sesión.",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const apiLogout = (req: Request, res: Response): void => {
  req.session.destroy((error) => {
    if (error) {
      console.error("apiLogout error:", error);
      res.status(500).json({
        success: false,
        message: "Error al cerrar sesión.",
        error: { code: "INTERNAL_ERROR" },
      });
      return;
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ success: true });
  });
};

export const apiMe = (req: Request, res: Response): void => {
  if (!req.session.userId) {
    res.status(200).json({
      success: true,
      authenticated: false,
      data: null,
    });
    return;
  }

  res.status(200).json({
    success: true,
    authenticated: true,
    data: {
      user: {
        id: req.session.userId,
        role: req.session.role,
        ageGroup: req.session.ageGroup,
      },
    },
  });
};

export const apiAdminCheck = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "Admin access granted",
  });
};
