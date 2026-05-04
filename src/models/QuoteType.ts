import mongoose, { Document, Schema } from "mongoose";

import {
  CONTENT_RATINGS,
  QUOTE_TYPE_SLUGS,
  type ContentRating,
  type QuoteTypeSlug,
} from "../types/domain.types";

export interface IQuoteType extends Document {
  name: string;
  slug: QuoteTypeSlug;
  description?: string;
  contentRating: ContentRating;
  isActive: boolean;
}

const quoteTypeSchema = new Schema<IQuoteType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      enum: QUOTE_TYPE_SLUGS,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    contentRating: {
      type: String,
      enum: CONTENT_RATINGS,
      required: true,
      default: "all",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const QuoteType = mongoose.model<IQuoteType>(
  "QuoteType",
  quoteTypeSchema
);

