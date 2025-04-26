import { model, Schema } from 'mongoose';
import { TRANSACTION_TYPES } from '../../constans/index.js';

const transactionsSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPES),
      required: true,
      default: TRANSACTION_TYPES.INCOME,
      index: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'category',
      index: true,
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
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Створюємо складений індекс для ефективного пошуку транзакцій за користувачем та періодом
transactionsSchema.index({ userId: 1, date: 1 });

export const TransactionsCollection = model('transaction', transactionsSchema);
