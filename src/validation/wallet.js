import Joi from 'joi';

const transactionCategories = [
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
];

export const createTransactionsSchema = Joi.object({
  date: Joi.date().required().messages({
    'any.required': 'Date is required',
    'date.base': 'Date should be date',
  }),

  type: Joi.string().valid('income', 'expense').required().messages({
    'any.required': 'Type is required',
    'any.only': 'Type should be either "income" or "expense"',
  }),

  category: Joi.string()
    .valid(...transactionCategories)
    .required()
    .messages({
      'any.required': 'Category is required',
      'any.only': `Category should be in the values: ${transactionCategories.join(
        ', ',
      )}.`,
    }),

  comment: Joi.string().messages({
    'string.base': 'Comment should be a string',
  }),

  sum: Joi.number().required().messages({
    'any.required': 'Sum is required',
    'number.base': 'Sum should be a number',
  }),
});

export const updateTransactionsSchema = Joi.object({
  date: Joi.date().messages({
    'date.base': 'Date should be date',
  }),

  type: Joi.string().valid('income', 'expense').messages({
    'any.only': 'Type should be either "income" or "expense"',
  }),

  category: Joi.string()
    .valid(...transactionCategories)
    .required()
    .messages({
      'any.only': `Category should be in the values: ${transactionCategories.join(
        ', ',
      )}.`,
    }),

  comment: Joi.string().messages({
    'string.base': 'Comment should be a string',
  }),

  sum: Joi.number().messages({
    'number.base': 'Sum should be a number',
  }),
})

  .min(1)
  .messages({
    'object.min':
      'The transaction update request body cannot be empty. It must contain at least one field to update',
  });

export const updateBalanceSchema = Joi.object({
  balance: Joi.number().messages({
    'number.base': 'Balance should be a number',
  }),
});
