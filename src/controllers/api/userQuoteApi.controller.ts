import { Request, Response } from "express";
import mongoose from "mongoose";

import { UserQuote } from "../../models/UserQuote";
import { Situation } from "../../models/Situation";
import { QuoteType } from "../../models/QuoteType";
import {
  CONTENT_RATINGS,
  SOURCE_TYPES,
} from "../../types/domain.types";

const userQuotePopulate = [
  { path: "situation", model: Situation, select: "name slug description isActive" },
  { path: "quoteType", model: QuoteType, select: "name slug description contentRating isActive" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isValidMongoId = (id: unknown): boolean =>
  typeof id === "string" && mongoose.Types.ObjectId.isValid(id);

const isValidContentRating = (value: string): boolean =>
  (CONTENT_RATINGS as readonly string[]).includes(value);

const isValidSourceType = (value: string): boolean =>
  (SOURCE_TYPES as readonly string[]).includes(value);

const normalizeText = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const getSessionUserId = (req: Request, res: Response): mongoose.Types.ObjectId | null => {
  const raw = req.session.userId;
  if (!raw) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return null;
  }
  return new mongoose.Types.ObjectId(raw);
};

const handleUserQuoteApiError = (error: unknown, res: Response): void => {
  console.error("UserQuote API error:", error);
  res.status(500).json({ success: false, message: "Internal server error" });
};

// ─── Paginación ───────────────────────────────────────────────────────────────

type ParseIntResult = { value: number } | { error: string };

const parsePositiveIntegerParam = (
  raw: unknown,
  name: string,
  min: number,
  max: number,
  defaultValue: number
): ParseIntResult => {
  if (raw === undefined) return { value: defaultValue };
  if (typeof raw !== "string") return { error: `Invalid ${name}` };
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed) || parsed < min || parsed > max) {
    return { error: `${name} must be an integer between ${min} and ${max}` };
  }
  return { value: parsed };
};

type PaginationResult = { page: number; limit: number } | { error: string };

const parsePagination = (query: Request["query"]): PaginationResult => {
  const pageResult = parsePositiveIntegerParam(query.page, "page", 1, 10_000, 1);
  if ("error" in pageResult) return pageResult;
  const limitResult = parsePositiveIntegerParam(query.limit, "limit", 1, 100, 20);
  if ("error" in limitResult) return limitResult;
  return { page: pageResult.value, limit: limitResult.value };
};

// ─── Resolvers de slug ────────────────────────────────────────────────────────

type SlugResolveResult =
  | { id: mongoose.Types.ObjectId }
  | { error: string; status: 400 | 404 };

const resolveSituationBySlug = async (slug: unknown): Promise<SlugResolveResult | null> => {
  if (slug === undefined) return null;
  if (typeof slug !== "string") return { error: "Invalid situation slug", status: 400 };
  const doc = await Situation.findOne({ slug, isActive: true }).select("_id");
  if (!doc) return { error: "Situation not found", status: 404 };
  return { id: doc._id as mongoose.Types.ObjectId };
};

const resolveQuoteTypeBySlug = async (slug: unknown): Promise<SlugResolveResult | null> => {
  if (slug === undefined) return null;
  if (typeof slug !== "string") return { error: "Invalid quoteType slug", status: 400 };
  const doc = await QuoteType.findOne({ slug, isActive: true }).select("_id");
  if (!doc) return { error: "Quote type not found", status: 404 };
  return { id: doc._id as mongoose.Types.ObjectId };
};

// ─── Builder de filtro ────────────────────────────────────────────────────────

type FilterBuildResult =
  | { filter: Record<string, unknown> }
  | { error: string; status: 400 | 404 };

const buildUserQuoteFilter = async (
  query: Request["query"],
  ownerUserId: mongoose.Types.ObjectId
): Promise<FilterBuildResult> => {
  const filter: Record<string, unknown> = { ownerUserId, isActive: true };

  const { contentRating, search } = query;

  if (contentRating !== undefined) {
    if (typeof contentRating !== "string" || !isValidContentRating(contentRating)) {
      return { error: "Invalid contentRating. Allowed values: all, teen, adult", status: 400 };
    }
    filter.contentRating = contentRating;
  }

  const situationResult = await resolveSituationBySlug(query.situation);
  if (situationResult !== null && "error" in situationResult) return situationResult;
  if (situationResult !== null) filter.situation = situationResult.id;

  const quoteTypeResult = await resolveQuoteTypeBySlug(query.quoteType);
  if (quoteTypeResult !== null && "error" in quoteTypeResult) return quoteTypeResult;
  if (quoteTypeResult !== null) filter.quoteType = quoteTypeResult.id;

  if (search !== undefined) {
    if (typeof search !== "string" || search.trim().length < 2 || search.trim().length > 100) {
      return { error: "search must be between 2 and 100 characters", status: 400 };
    }
    filter.textNormalized = { $regex: normalizeText(search), $options: "i" };
  }

  return { filter };
};

// ─── Handler de duplicado Mongo 11000 ────────────────────────────────────────

const handleDuplicateUserQuoteError = (error: unknown, res: Response): boolean => {
  if (
    error instanceof Error &&
    "code" in error &&
    (error as { code?: unknown }).code === 11000
  ) {
    res.status(409).json({ success: false, message: "You already have a quote with this text" });
    return true;
  }
  return false;
};

// ─── Handlers ─────────────────────────────────────────────────────────────────

export const getMyUserQuotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getSessionUserId(req, res);
    if (!userId) return;

    const pagination = parsePagination(req.query);
    if ("error" in pagination) {
      res.status(400).json({ success: false, message: pagination.error });
      return;
    }
    const { page, limit } = pagination;

    const filterResult = await buildUserQuoteFilter(req.query, userId);
    if ("error" in filterResult) {
      res.status(filterResult.status).json({ success: false, message: filterResult.error });
      return;
    }
    const { filter } = filterResult;

    const [quotes, total] = await Promise.all([
      UserQuote.find(filter)
        .populate(userQuotePopulate)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      UserQuote.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: quotes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    handleUserQuoteApiError(error, res);
  }
};

export const createMyUserQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getSessionUserId(req, res);
    if (!userId) return;

    const {
      text,
      authorText,
      situation,
      quoteType,
      language,
      contentRating = "all",
      sourceType = "unknown",
      sourceReference,
    } = req.body;

    if (typeof text !== "string" || !text.trim()) {
      res.status(400).json({ success: false, message: "text is required and must be a non-empty string" });
      return;
    }

    if (authorText !== undefined) {
      if (typeof authorText !== "string" || authorText.trim().length > 200) {
        res.status(400).json({ success: false, message: "authorText must be a string of max 200 characters" });
        return;
      }
    }

    if (!isValidContentRating(contentRating)) {
      res.status(400).json({ success: false, message: "Invalid contentRating. Allowed values: all, teen, adult" });
      return;
    }

    if (!isValidSourceType(sourceType)) {
      res.status(400).json({
        success: false,
        message: "Invalid sourceType. Allowed values: book, movie, tv_show, historical, original, unknown",
      });
      return;
    }

    const situationResult = await resolveSituationBySlug(situation);
    if (situationResult !== null && "error" in situationResult) {
      res.status(situationResult.status).json({ success: false, message: situationResult.error });
      return;
    }

    const quoteTypeResult = await resolveQuoteTypeBySlug(quoteType);
    if (quoteTypeResult !== null && "error" in quoteTypeResult) {
      res.status(quoteTypeResult.status).json({ success: false, message: quoteTypeResult.error });
      return;
    }

    const created = await UserQuote.create({
      text: text.trim(),
      textNormalized: normalizeText(text),
      authorText: authorText?.trim(),
      situation: situationResult?.id,
      quoteType: quoteTypeResult?.id,
      language: typeof language === "string" ? language.trim().toLowerCase() : "es",
      contentRating,
      sourceType,
      sourceReference: typeof sourceReference === "string" ? sourceReference.trim() : undefined,
      ownerUserId: userId,
      isActive: true,
    });

    const populated = await UserQuote.findById(created._id).populate(userQuotePopulate);

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (handleDuplicateUserQuoteError(error, res)) return;
    handleUserQuoteApiError(error, res);
  }
};

export const getRandomMyUserQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getSessionUserId(req, res);
    if (!userId) return;

    const filterResult = await buildUserQuoteFilter(req.query, userId);
    if ("error" in filterResult) {
      res.status(filterResult.status).json({ success: false, message: filterResult.error });
      return;
    }
    const { filter } = filterResult;

    const total = await UserQuote.countDocuments(filter);
    if (total === 0) {
      res.status(404).json({ success: false, message: "No active quotes found" });
      return;
    }

    const randomSkip = Math.floor(Math.random() * total);
    const quote = await UserQuote.findOne(filter).skip(randomSkip).populate(userQuotePopulate);

    if (!quote) {
      res.status(404).json({ success: false, message: "No active quotes found" });
      return;
    }

    res.status(200).json({ success: true, data: quote });
  } catch (error) {
    handleUserQuoteApiError(error, res);
  }
};

export const getMyUserQuoteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getSessionUserId(req, res);
    if (!userId) return;

    const id = req.params.id as string;
    if (!isValidMongoId(id)) {
      res.status(400).json({ success: false, message: "Invalid quote id" });
      return;
    }

    const quote = await UserQuote.findOne({
      _id: id,
      ownerUserId: userId,
      isActive: true,
    }).populate(userQuotePopulate);

    if (!quote) {
      res.status(404).json({ success: false, message: "Quote not found" });
      return;
    }

    res.status(200).json({ success: true, data: quote });
  } catch (error) {
    handleUserQuoteApiError(error, res);
  }
};

export const updateMyUserQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getSessionUserId(req, res);
    if (!userId) return;

    const id = req.params.id as string;
    if (!isValidMongoId(id)) {
      res.status(400).json({ success: false, message: "Invalid quote id" });
      return;
    }

    const updateData: Record<string, unknown> = {};

    if (req.body.text !== undefined) {
      if (typeof req.body.text !== "string" || !req.body.text.trim()) {
        res.status(400).json({ success: false, message: "text must be a non-empty string" });
        return;
      }
      updateData.text = req.body.text.trim();
      updateData.textNormalized = normalizeText(req.body.text);
    }

    if (req.body.authorText !== undefined) {
      if (typeof req.body.authorText !== "string" || req.body.authorText.trim().length > 200) {
        res.status(400).json({ success: false, message: "authorText must be a string of max 200 characters" });
        return;
      }
      updateData.authorText = req.body.authorText.trim();
    }

    if (req.body.contentRating !== undefined) {
      if (typeof req.body.contentRating !== "string" || !isValidContentRating(req.body.contentRating)) {
        res.status(400).json({ success: false, message: "Invalid contentRating. Allowed values: all, teen, adult" });
        return;
      }
      updateData.contentRating = req.body.contentRating;
    }

    if (req.body.sourceType !== undefined) {
      if (typeof req.body.sourceType !== "string" || !isValidSourceType(req.body.sourceType)) {
        res.status(400).json({
          success: false,
          message: "Invalid sourceType. Allowed values: book, movie, tv_show, historical, original, unknown",
        });
        return;
      }
      updateData.sourceType = req.body.sourceType;
    }

    if (req.body.situation !== undefined) {
      const situationResult = await resolveSituationBySlug(req.body.situation);
      if (situationResult !== null && "error" in situationResult) {
        res.status(situationResult.status).json({ success: false, message: situationResult.error });
        return;
      }
      updateData.situation = situationResult?.id ?? null;
    }

    if (req.body.quoteType !== undefined) {
      const quoteTypeResult = await resolveQuoteTypeBySlug(req.body.quoteType);
      if (quoteTypeResult !== null && "error" in quoteTypeResult) {
        res.status(quoteTypeResult.status).json({ success: false, message: quoteTypeResult.error });
        return;
      }
      updateData.quoteType = quoteTypeResult?.id ?? null;
    }

    if (req.body.language !== undefined && typeof req.body.language === "string") {
      updateData.language = req.body.language.trim().toLowerCase();
    }

    if (req.body.sourceReference !== undefined && typeof req.body.sourceReference === "string") {
      updateData.sourceReference = req.body.sourceReference.trim();
    }

    const updated = await UserQuote.findOneAndUpdate(
      { _id: id, ownerUserId: userId, isActive: true },
      updateData,
      { new: true, runValidators: true }
    ).populate(userQuotePopulate);

    if (!updated) {
      res.status(404).json({ success: false, message: "Quote not found" });
      return;
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    if (handleDuplicateUserQuoteError(error, res)) return;
    handleUserQuoteApiError(error, res);
  }
};

export const deleteMyUserQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getSessionUserId(req, res);
    if (!userId) return;

    const id = req.params.id as string;
    if (!isValidMongoId(id)) {
      res.status(400).json({ success: false, message: "Invalid quote id" });
      return;
    }

    const deleted = await UserQuote.findOneAndUpdate(
      { _id: id, ownerUserId: userId, isActive: true },
      { isActive: false },
      { new: true, runValidators: true }
    ).populate(userQuotePopulate);

    if (!deleted) {
      res.status(404).json({ success: false, message: "Quote not found" });
      return;
    }

    res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    handleUserQuoteApiError(error, res);
  }
};
