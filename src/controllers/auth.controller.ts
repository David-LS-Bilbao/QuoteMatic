import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { User } from "../models/User";
import { AGE_GROUPS, type AgeGroup } from "../types/domain.types";

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

const isValidAgeGroup = (value: string): value is AgeGroup => {
  return (AGE_GROUPS as readonly string[]).includes(value);
};

export const showRegisterForm = (_req: Request, res: Response): void => {
  res.render("auth/register", {
    title: "Registro | QuoteMatic",
    error: null,
  });
};

export const register = async (
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
      res.status(400).render("auth/register", {
        title: "Registro | QuoteMatic",
        error: "Todos los campos son obligatorios.",
      });
      return;
    }

    if (ageRange === "under_14") {
      res.status(403).render("auth/register", {
        title: "Registro | QuoteMatic",
        error: "No se permite el registro a menores de 14 años.",
      });
      return;
    }

    if (!isValidAgeGroup(ageRange)) {
      res.status(400).render("auth/register", {
        title: "Registro | QuoteMatic",
        error: "Rango de edad no válido.",
      });
      return;
    }

    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      res.status(409).render("auth/register", {
        title: "Registro | QuoteMatic",
        error: "Ya existe un usuario con ese email.",
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      ageGroup: ageRange,
    });

    res.redirect("/auth/login");
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).render("auth/register", {
      title: "Registro | QuoteMatic",
      error: "Error interno al registrar usuario.",
    });
  }
};

export const showLoginForm = (_req: Request, res: Response): void => {
  res.render("auth/login", {
    title: "Login | QuoteMatic",
    error: null,
  });
};

export const login = async (
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
      res.status(400).render("auth/login", {
        title: "Login | QuoteMatic",
        error: "Email y contraseña son obligatorios.",
      });
      return;
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      res.status(401).render("auth/login", {
        title: "Login | QuoteMatic",
        error: "Email o contraseña incorrectos.",
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).render("auth/login", {
        title: "Login | QuoteMatic",
        error: "Usuario inactivo.",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      res.status(401).render("auth/login", {
        title: "Login | QuoteMatic",
        error: "Email o contraseña incorrectos.",
      });
      return;
    }

    req.session.userId = user._id.toString();
    req.session.role = user.role;
    req.session.ageGroup = user.ageGroup;

    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).render("auth/login", {
      title: "Login | QuoteMatic",
      error: "Error interno al iniciar sesión.",
    });
  }
};

export const logout = (req: Request, res: Response): void => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Error al cerrar sesión.",
      });
      return;
    }

    res.clearCookie("connect.sid");
    res.redirect("/");
  });
};

export const me = (req: Request, res: Response): void => {
  if (!req.session.userId) {
    res.status(200).json({
      authenticated: false,
    });
    return;
  }

  res.status(200).json({
    authenticated: true,
    user: {
      userId: req.session.userId,
      role: req.session.role,
      ageGroup: req.session.ageGroup,
    },
  });
};