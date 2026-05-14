import { Request, Response } from "express";
import mongoose from "mongoose";

import { Author } from "../../models/Author";
import { Quote } from "../../models/Quote";
import { QuoteType } from "../../models/QuoteType";
import { Situation } from "../../models/Situation";
import {
  AUTHOR_TYPES,
  CONTENT_RATINGS,
  SOURCE_TYPES,
  VERIFICATION_STATUSES,
  type AuthorType,
  type ContentRating,
  type SourceType,
  type VerificationStatus,
} from "../../types/domain.types";

const MAX_BULK_SIZE = 500;

const normalizeText = (value: string): string =>
  value.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const findOrCreateAuthorByName = async (
  name: string,
  authorType: AuthorType
): Promise<mongoose.Types.ObjectId> => {
  const normalized = normalizeText(name);
  const existing = await Author.findOne({ normalizedName: normalized });
  if (existing) return existing._id as mongoose.Types.ObjectId;

  const created = await Author.create({
    name: name.trim(),
    normalizedName: normalized,
    authorType,
    sourceType: "unknown" as SourceType,
    verificationStatus: "pending" as VerificationStatus,
    isVerified: false,
    isActive: true,
  });
  return created._id as mongoose.Types.ObjectId;
};

const isDuplicateKeyError = (err: unknown): boolean => {
  if (err != null && typeof err === "object" && "code" in err) {
    return (err as { code: unknown }).code === 11000;
  }
  return false;
};

interface BulkError {
  row: number;
  text: string;
  message: string;
}

export const bulkCreateQuotes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { quotes } = req.body;

    if (!Array.isArray(quotes) || quotes.length === 0) {
      res.status(400).json({
        success: false,
        message: "quotes must be a non-empty array",
      });
      return;
    }

    if (quotes.length > MAX_BULK_SIZE) {
      res.status(400).json({
        success: false,
        message: `Maximum ${MAX_BULK_SIZE} quotes per request`,
      });
      return;
    }

    // Preload all active catalogs once for the whole batch
    const [situations, quoteTypes] = await Promise.all([
      Situation.find({ isActive: true }).select("_id slug").lean(),
      QuoteType.find({ isActive: true }).select("_id slug").lean(),
    ]);

    const situationMap = new Map<string, mongoose.Types.ObjectId>(
      situations.map((s) => [s.slug, s._id as mongoose.Types.ObjectId])
    );
    const quoteTypeMap = new Map<string, mongoose.Types.ObjectId>(
      quoteTypes.map((qt) => [qt.slug, qt._id as mongoose.Types.ObjectId])
    );

    let imported = 0;
    const errors: BulkError[] = [];

    for (let i = 0; i < quotes.length; i++) {
      const row = quotes[i] as Record<string, unknown>;
      const rowNumber = i + 1;

      // Required string fields
      if (typeof row.text !== "string" || !row.text.trim()) {
        errors.push({ row: rowNumber, text: String(row.text ?? ""), message: "text is required" });
        continue;
      }
      if (typeof row.authorName !== "string" || !row.authorName.trim()) {
        errors.push({ row: rowNumber, text: row.text.trim(), message: "authorName is required" });
        continue;
      }
      if (typeof row.situationSlug !== "string" || !row.situationSlug.trim()) {
        errors.push({ row: rowNumber, text: row.text.trim(), message: "situationSlug is required" });
        continue;
      }
      if (typeof row.quoteTypeSlug !== "string" || !row.quoteTypeSlug.trim()) {
        errors.push({ row: rowNumber, text: row.text.trim(), message: "quoteTypeSlug is required" });
        continue;
      }

      const situationId = situationMap.get(row.situationSlug.trim().toLowerCase());
      if (!situationId) {
        errors.push({ row: rowNumber, text: row.text.trim(), message: `Situation not found: ${row.situationSlug}` });
        continue;
      }

      const quoteTypeId = quoteTypeMap.get(row.quoteTypeSlug.trim().toLowerCase());
      if (!quoteTypeId) {
        errors.push({ row: rowNumber, text: row.text.trim(), message: `QuoteType not found: ${row.quoteTypeSlug}` });
        continue;
      }

      // Optional fields with safe defaults
      const authorType: AuthorType =
        typeof row.authorType === "string" &&
        (AUTHOR_TYPES as readonly string[]).includes(row.authorType)
          ? (row.authorType as AuthorType)
          : "unknown";

      const language: string =
        typeof row.language === "string" && row.language.trim()
          ? row.language.trim().toLowerCase()
          : "es";

      const contentRating: ContentRating =
        typeof row.contentRating === "string" &&
        (CONTENT_RATINGS as readonly string[]).includes(row.contentRating)
          ? (row.contentRating as ContentRating)
          : "all";

      const verificationStatus: VerificationStatus =
        typeof row.verificationStatus === "string" &&
        (VERIFICATION_STATUSES as readonly string[]).includes(row.verificationStatus)
          ? (row.verificationStatus as VerificationStatus)
          : "pending";

      const sourceType: SourceType =
        typeof row.sourceType === "string" &&
        (SOURCE_TYPES as readonly string[]).includes(row.sourceType)
          ? (row.sourceType as SourceType)
          : "unknown";

      const sourceReference: string | undefined =
        typeof row.sourceReference === "string" && row.sourceReference.trim()
          ? row.sourceReference.trim()
          : undefined;

      try {
        const authorId = await findOrCreateAuthorByName(row.authorName.trim(), authorType);

        await Quote.create({
          text: row.text.trim(),
          textNormalized: normalizeText(row.text),
          author: authorId,
          situation: situationId,
          quoteType: quoteTypeId,
          language,
          contentRating,
          sourceType,
          sourceReference,
          verificationStatus,
          isActive: true,
        });

        imported++;
      } catch (err) {
        errors.push({
          row: rowNumber,
          text: row.text.trim(),
          message: isDuplicateKeyError(err)
            ? "Frase duplicada para este autor"
            : err instanceof Error
              ? err.message
              : "Error al crear la frase",
        });
      }
    }

    res.status(201).json({
      success: true,
      data: {
        total: quotes.length,
        imported,
        skipped: errors.length,
        errors,
      },
    });
  } catch (error) {
    console.error("Bulk quote import error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
