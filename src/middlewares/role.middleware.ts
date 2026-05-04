import { NextFunction, Request, Response } from "express";

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.session.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Admin role required",
    });
    return;
  }

  next();
};
/*
Separa la autenticación del permiso.
isAuthenticated responde: “¿estás logueado?”
isAdmin responde: “¿eres admin?”

*/