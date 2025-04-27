import Joi from 'joi';

export const createTransactionsSchema = Joi.object({
  date: Joi.date().required().messages({
    'any.required': 'Date is required',
    'date.base': 'Date should be date',
  }),
  type: Joi.string().valid('income', 'expense').required().messages({
    'any.required': 'Type is required',
    'any.only': 'Type should be either "income" or "expense"',
  }),
  categoryId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Перевірка на формат ObjectId
    .required()
    .messages({
      'any.required': 'CategoryId is required',
      'string.base': 'CategoryId must be a string',
      'string.pattern.base': 'CategoryId must be a valid ObjectId format',
    }),
  comment: Joi.string().allow('').messages({
    'string.base': 'Comment should be a string',
  }),
  sum: Joi.number().positive().required().messages({
    'any.required': 'Sum is required',
    'number.base': 'Sum should be a number',
    'number.positive': 'Sum should be a positive number',
  }),
});

export const updateTransactionsSchema = Joi.object({
  date: Joi.date().messages({
    'date.base': 'Date should be date',
  }),
  type: Joi.string().valid('income', 'expense').messages({
    'any.only': 'Type should be either "income" or "expense"',
  }),
  categoryId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Перевірка на формат ObjectId
    .messages({
      'string.base': 'CategoryId must be a string',
      'string.pattern.base': 'CategoryId must be a valid ObjectId format',
    }),
  comment: Joi.string().allow('').messages({
    'string.base': 'Comment should be a string',
  }),
  sum: Joi.number().positive().messages({
    'number.base': 'Sum should be a number',
    'number.positive': 'Sum should be a positive number',
  }),
})
  .min(1)
  .messages({
    'object.min':
      'The transaction update request body cannot be empty. It must contain at least one field to update',
  });
