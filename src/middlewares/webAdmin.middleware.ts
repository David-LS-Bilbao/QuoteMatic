import { NextFunction, Request, Response } from "express";

export const requireWebAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session.userId) {
    res.redirect("/auth/login");
    return;
  }
  if (req.session.role !== "admin") {
    res.redirect("/");
    return;
  }
  next();
};
