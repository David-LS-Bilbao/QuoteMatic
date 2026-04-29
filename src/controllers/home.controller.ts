import { Request, Response } from "express";

// controlador de la página principal del aplicacion 

export const renderHome = (_req: Request, res: Response): void => {
  res.render("index", {
    appName: "QuoteMatic",
    title: "QuoteMatic | Frases para cada situación",
  });
};