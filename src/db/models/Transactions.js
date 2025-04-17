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
        'Main expenses',
        'Products',
        'Car',
        'Self care',
        'Child care',
        'Household products',
        'Education',
        'Leisure',
        'Other expenses',
        'Entertainment',
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
      default: '0',
    },

    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ContactsCollection = model('transaction', transactionsSchema);
