import { NextFunction, Request, Response } from "express";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.session.userId) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  next();
};

/*
Comprueba si existe sesión de usuario.
Si no hay userId en sesión, bloquea con 401.
Si hay sesión, deja continuar al siguiente middleware/controlador.
*/