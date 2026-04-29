import mongoose, { Document, Schema } from "mongoose";

// Types
import {
  AUTHOR_TYPES,
  SOURCE_TYPES,
  VERIFICATION_STATUSES,
  type AuthorType,
  type SourceType,
  type VerificationStatus,
} from "../types/domain.types";


// interface para Author donde se definen los campos.
export interface IAuthor extends Document {
  name: string;
  normalizedName: string;
  authorType: AuthorType;
  sourceWork?: string;
  sourceType: SourceType;
  verificationSource?: string;
  verificationStatus: VerificationStatus;
  isVerified: boolean;
  isActive: boolean;
}


const authorSchema = new Schema<IAuthor>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    normalizedName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    authorType: {
      type: String,
      enum: AUTHOR_TYPES,
      required: true,
      default: "unknown",
    },
    sourceWork: {
      type: String,
      trim: true,
    },
    sourceType: {
      type: String,
      enum: SOURCE_TYPES,
      required: true,
      default: "unknown",
    },
    verificationSource: {
      type: String,
      trim: true,
    },
    verificationStatus: {
      type: String,
      enum: VERIFICATION_STATUSES,
      required: true,
      default: "pending",
    },
    isVerified: {
      type: Boolean,
      default: false,
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

export const Author = mongoose.model<IAuthor>("Author", authorSchema);