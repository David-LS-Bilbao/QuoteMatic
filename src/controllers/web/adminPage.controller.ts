import { Request, Response } from "express";

import { Author } from "../../models/Author";
import { Quote } from "../../models/Quote";
import { QuoteType } from "../../models/QuoteType";
import { Situation } from "../../models/Situation";

const quotePopulate = [
  { path: "author", model: Author, select: "name authorType sourceWork isActive" },
  { path: "situation", model: Situation, select: "name slug description isActive" },
  { path: "quoteType", model: QuoteType, select: "name slug description contentRating isActive" },
];

export const renderAdminPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.session.userId) {
    res.redirect("/auth/login");
    return;
  }

  if (req.session.role !== "admin") {
    res.status(403).render("admin", {
      title: "Admin | QuoteMatic",
      isForbidden: true,
      quotes: [],
      user: {
        isAuthenticated: true,
        role: req.session.role ?? null,
        ageGroup: req.session.ageGroup ?? null,
      },
    });
    return;
  }

  const quotes = await Quote.find({ isActive: true })
    .populate(quotePopulate)
    .sort({ updatedAt: -1 })
    .limit(12)
    .lean();

  res.render("admin", {
    title: "Admin | QuoteMatic",
    isForbidden: false,
    quotes,
    user: {
      isAuthenticated: true,
      role: req.session.role,
      ageGroup: req.session.ageGroup ?? null,
    },
  });
};
