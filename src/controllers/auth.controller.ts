import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { User } from "../models/User";
import { AGE_GROUPS, type AgeGroup } from "../types/domain.types";

const SALT_ROUNDS = 10;

// tipos para el cuerpo de la solicitud de registro
type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
  ageRange?: string;
};

// validaciones
const isValidAgeGroup = (value: string): value is AgeGroup => {
  return (AGE_GROUPS as readonly string[]).includes(value);
};


// controladores
export const showRegisterForm = (_req: Request, res: Response): void => {
  res.render("auth/register", {
    title: "Registro | QuoteMatic",
    error: null,
  });
};


// controlador de registro con validaciones y manejo de errores
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