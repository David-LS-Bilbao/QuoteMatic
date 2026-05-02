import { Request, Response } from "express";
import mongoose from "mongoose";

import { Favorite } from "../../models/Favorite";
import { Quote } from "../../models/Quote";
import { Author } from "../../models/Author";
import { Situation } from "../../models/Situation";
import { QuoteType } from "../../models/QuoteType";

// Populate reutilizable para devolver la frase favorita con sus relaciones principales.
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

const isValidMongoId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

const handleFavoriteApiError = (error: unknown, res: Response): void => {
  console.error("Favorite API error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

const getSessionUserId = (req: Request, res: Response): string | null => {
  const userId = req.session.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return null;
  }

  return userId;
};

export const getMyFavorites = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = getSessionUserId(req, res);

    if (!userId) {
      return;
    }

    const favorites = await Favorite.find({
      user: userId,
      isActive: true,
    })
      .populate(favoriteQuotePopulate)
      .sort({ updatedAt: -1 })
      .lean();

    // Si una quote fue desactivada después de marcarla como favorita,
    // el populate con match puede devolver quote: null. No la exponemos.
    const activeFavorites = favorites.filter((favorite) => favorite.quote !== null);

    res.status(200).json({
      success: true,
      data: activeFavorites,
    });
  } catch (error) {
    handleFavoriteApiError(error, res);
  }
};

export const addFavorite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = getSessionUserId(req, res);

    if (!userId) {
      return;
    }

    const { quoteId } = req.params;

    if (typeof quoteId !== "string" || !isValidMongoId(quoteId)) {
      res.status(400).json({
        success: false,
        message: "Invalid quote id",
      });
      return;
    }

    const quoteExists = await Quote.exists({
      _id: quoteId,
      isActive: true,
    });

    if (!quoteExists) {
      res.status(404).json({
        success: false,
        message: "Quote not found",
      });
      return;
    }

    const existingFavorite = await Favorite.findOne({
      user: userId,
      quote: quoteId,
    });

    if (!existingFavorite) {
      const createdFavorite = await Favorite.create({
        user: userId,
        quote: quoteId,
        isActive: true,
      });

      const populatedFavorite = await Favorite.findById(createdFavorite._id)
        .populate(favoriteQuotePopulate);

      res.status(201).json({
        success: true,
        message: "Favorite added",
        data: populatedFavorite,
      });
      return;
    }

    if (existingFavorite.isActive) {
      const populatedFavorite = await Favorite.findById(existingFavorite._id)
        .populate(favoriteQuotePopulate);

      res.status(200).json({
        success: true,
        message: "Quote already in favorites",
        data: populatedFavorite,
      });
      return;
    }

    existingFavorite.isActive = true;
    await existingFavorite.save();

    const reactivatedFavorite = await Favorite.findById(existingFavorite._id)
      .populate(favoriteQuotePopulate);

    res.status(200).json({
      success: true,
      message: "Favorite reactivated",
      data: reactivatedFavorite,
    });
  } catch (error) {
    handleFavoriteApiError(error, res);
  }
};

export const removeFavorite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = getSessionUserId(req, res);

    if (!userId) {
      return;
    }

    const { quoteId } = req.params;

    if (typeof quoteId !== "string" || !isValidMongoId(quoteId)) {
      res.status(400).json({
        success: false,
        message: "Invalid quote id",
      });
      return;
    }

    const removedFavorite = await Favorite.findOneAndUpdate(
      {
        user: userId,
        quote: quoteId,
        isActive: true,
      },
      {
        isActive: false,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate(favoriteQuotePopulate);

    if (!removedFavorite) {
      res.status(404).json({
        success: false,
        message: "Active favorite not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Favorite removed",
      data: removedFavorite,
    });
  } catch (error) {
    handleFavoriteApiError(error, res);
  }
};

/*
Centraliza la lógica REST de favoritos.
Usa sesión real: req.session.userId.
Valida ObjectId antes de consultar MongoDB.
Evita duplicados.
Permite reactivar favoritos inactivos.
Usa borrado lógico con isActive: false.
*/