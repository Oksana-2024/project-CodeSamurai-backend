import createHttpError from 'http-errors';

import { CategoriesCollection } from '../db/models/Categories.js';

import { TRANSACTION_TYPES } from '../constans/index.js';

export const getAllCategories = async () => {
  const categories = await CategoriesCollection.find().lean();

  const result = {
    [TRANSACTION_TYPES.INCOME]: [],
    [TRANSACTION_TYPES.EXPENSE]: [],
  };

  categories.forEach((category) => {
    result[category.type].push({ _id: category._id, name: category.name });
  });

  return result;
};

export const getCategoriesByType = async (type) => {
  const normalizedType = type.toLowerCase();

  if (
    normalizedType !== TRANSACTION_TYPES.INCOME &&
    normalizedType !== TRANSACTION_TYPES.EXPENSE
  ) {
    throw createHttpError(400, `Invalid category type: ${type}`);
  }

  const categories = await CategoriesCollection.find({ type: normalizedType })
    .select('_id name')
    .lean();

  return {
    type: normalizedType,

    categories: categories.map((category) => ({
      _id: category._id,
      name: category.name,
    })),
  };
};
