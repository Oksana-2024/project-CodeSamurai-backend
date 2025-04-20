import { model, Schema } from 'mongoose';

const transactionsSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
      default: 'income',
    },
    category: {
      type: String,
      enum: [
        'income',
        'main expenses',
        'products',
        'car',
        'self care',
        'child care',
        'household products',
        'education',
        'leisure',
        'other expenses',
        'entertainment',
      ],
      required: true,
      default: 'Products',
    },
    comment: {
      type: String,
      default: ' ',
    },
    sum: {
      type: Number,
      required: true,
      default: 0,
    },

    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const TransactionsCollection = model('transaction', transactionsSchema);
