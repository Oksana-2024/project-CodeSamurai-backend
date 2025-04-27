import { model, Schema } from 'mongoose';

const transactionsSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
      default: 'income',
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'category',
    },
    comment: {
      type: String,
      default: '',
    },
    sum: {
      type: Number,
      required: true,
      default: 0,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const TransactionsCollection = model('transaction', transactionsSchema);
