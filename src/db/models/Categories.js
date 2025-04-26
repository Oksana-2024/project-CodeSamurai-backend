import { model, Schema } from 'mongoose';
import { TRANSACTION_TYPES } from '../../constans/index.js';

const categoriesSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPES),
      required: true,
      index: true,
    },
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
