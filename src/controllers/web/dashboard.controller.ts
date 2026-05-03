import { Request, Response } from "express";

import { QuoteType } from "../../models/QuoteType";
import { Situation } from "../../models/Situation";

export const renderDashboard = async (req: Request, res: Response): Promise<void> => {
  const [situations, quoteTypes] = await Promise.all([
    Situation.find({ isActive: true }).sort({ name: 1 }).lean(),
    QuoteType.find({ isActive: true }).sort({ name: 1 }).lean(),
  ]);

  res.render("dashboard", {
    title: "Dashboard | QuoteMatic",
    situations,
    quoteTypes,
    user: {
      isAuthenticated: Boolean(req.session.userId),
      role: req.session.role ?? null,
      ageGroup: req.session.ageGroup ?? null,
    },
  });
};
