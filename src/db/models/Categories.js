import { model, Schema } from 'mongoose';

const categoriesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const CategoriesCollection = model('category', categoriesSchema);
