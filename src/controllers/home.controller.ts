import { Request, Response } from "express";

// controlador de la página principal del aplicacion 

export const renderHome = (req: Request, res: Response): void => {
  res.render("index", {
    appName: "QuoteMatic",
    title: "QuoteMatic | Frases para cada situación",
    user: {
      isAuthenticated: Boolean(req.session.userId),
      role: req.session.role ?? null,
      ageGroup: req.session.ageGroup ?? null,
    },
  });
};
