import mongoose, { Document, Schema, Types } from "mongoose";

import {
  CONTENT_RATINGS,
  SOURCE_TYPES,
  VERIFICATION_STATUSES,
  type ContentRating,
  type SourceType,
  type VerificationStatus,
} from "../types/domain.types";

export interface IQuote extends Document {
  text: string;
  textNormalized: string;
  author: Types.ObjectId;
  situation: Types.ObjectId;
  quoteType: Types.ObjectId;
  language: string;
  contentRating: ContentRating;
  sourceType: SourceType;
  sourceReference?: string;
  verificationStatus: VerificationStatus;
  isActive: boolean;
}

const quoteSchema = new Schema<IQuote>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    textNormalized: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      required: true,
      index: true,
    },
    situation: {
      type: Schema.Types.ObjectId,
      ref: "Situation",
      required: true,
      index: true,
    },
    quoteType: {
      type: Schema.Types.ObjectId,
      ref: "QuoteType",
      required: true,
      index: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      default: "es",
    },
    contentRating: {
      type: String,
      enum: CONTENT_RATINGS,
      required: true,
      default: "all",
      index: true,
    },
    sourceType: {
      type: String,
      enum: SOURCE_TYPES,
      required: true,
      default: "unknown",
    },
    sourceReference: {
      type: String,
      trim: true,
    },
    verificationStatus: {
      type: String,
      enum: VERIFICATION_STATUSES,
      required: true,
      default: "pending",
      index: true,
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

quoteSchema.index(
  {
    textNormalized: 1,
    author: 1,
  },
  {
    unique: true,
  }
);

export const Quote = mongoose.model<IQuote>("Quote", quoteSchema);
