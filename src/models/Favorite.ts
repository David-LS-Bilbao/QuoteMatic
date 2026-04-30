import mongoose, { Document, Schema, Types } from "mongoose";

export interface IFavorite extends Document {
  user: Types.ObjectId;
  quote: Types.ObjectId;
  isActive: boolean;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    quote: {
      type: Schema.Types.ObjectId,
      ref: "Quote",
      required: true,
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

favoriteSchema.index(
  {
    user: 1,
    quote: 1,
  },
  {
    unique: true,
  }
);

export const Favorite = mongoose.model<IFavorite>("Favorite", favoriteSchema);