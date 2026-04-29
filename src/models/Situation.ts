import mongoose,{Document,Schema} from "mongoose";  

export interface ISituation extends Document{
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

const situationSchema = new Schema<ISituation>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: { 
      type: Boolean,
      index: true,
      default: true,
    },
  },    
  {
    timestamps: true,
  }
);  

export const Situation = mongoose.model<ISituation>(
    "Situations",
     situationSchema
    );   
