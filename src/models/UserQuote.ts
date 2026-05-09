import mongoose, { Document, Schema, Types } from "mongoose";

import {
  CONTENT_RATINGS,
  SOURCE_TYPES,
  type ContentRating,
  type SourceType,
} from "../types/domain.types";

export interface IUserQuote extends Document {
  text: string;
  textNormalized: string;
  authorText?: string;
  situation?: Types.ObjectId;
  quoteType?: Types.ObjectId;
  language: string;
  contentRating: ContentRating;
  sourceType: SourceType;
  sourceReference?: string;
  ownerUserId: Types.ObjectId;
  isActive: boolean;
}

const userQuoteSchema = new Schema<IUserQuote>(
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
    },
    authorText: {
      type: String,
      trim: true,
    },
    situation: {
      type: Schema.Types.ObjectId,
      ref: "Situation",
      index: true,
    },
    quoteType: {
      type: Schema.Types.ObjectId,
      ref: "QuoteType",
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
    ownerUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userQuoteSchema.index({ ownerUserId: 1, isActive: 1 });
userQuoteSchema.index({ ownerUserId: 1, textNormalized: 1 }, { unique: true });

export const UserQuote = mongoose.model<IUserQuote>("UserQuote", userQuoteSchema);
