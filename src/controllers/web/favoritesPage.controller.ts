import { Request, Response } from "express";

import { Author } from "../../models/Author";
import { Favorite } from "../../models/Favorite";
import { Quote } from "../../models/Quote";
import { QuoteType } from "../../models/QuoteType";
import { Situation } from "../../models/Situation";

const favoriteQuotePopulate = {
  path: "quote",
  model: Quote,
  match: { isActive: true },
  populate: [
    { path: "author", model: Author, select: "name authorType sourceWork isActive" },
    { path: "situation", model: Situation, select: "name slug description isActive" },
    { path: "quoteType", model: QuoteType, select: "name slug description contentRating isActive" },
  ],
};

export const renderFavoritesPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.session.userId) {
    res.redirect("/auth/login");
    return;
  }

  const favorites = await Favorite.find({
    user: req.session.userId,
    isActive: true,
  })
    .populate(favoriteQuotePopulate)
    .sort({ updatedAt: -1 })
    .lean();

  const activeFavorites = favorites.filter((favorite) => favorite.quote !== null);

  res.render("favorites", {
    title: "Favoritos | QuoteMatic",
    favorites: activeFavorites,
    user: {
      isAuthenticated: true,
      role: req.session.role ?? null,
      ageGroup: req.session.ageGroup ?? null,
    },
  });
};
