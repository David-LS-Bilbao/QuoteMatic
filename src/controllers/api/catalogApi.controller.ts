import { Request, Response } from "express";

import { Author } from "../../models/Author";
import { Situation } from "../../models/Situation";
import { QuoteType } from "../../models/QuoteType";

const handleApiError = (error: unknown, res: Response): void => {
  console.error("Catalog API error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export const getAuthors = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const authors = await Author.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: authors,
    });
  } catch (error) {
    handleApiError(error, res);
  }
};

export const getSituations = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const situations = await Situation.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: situations,
    });
  } catch (error) {
    handleApiError(error, res);
  }
};

export const getQuoteTypes = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const quoteTypes = await QuoteType.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: quoteTypes,
    });
  } catch (error) {
    handleApiError(error, res);
  }
};
