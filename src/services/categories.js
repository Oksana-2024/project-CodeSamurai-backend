import createHttpError from 'http-errors';

import { CategoriesCollection } from '../db/models/Categories.js';

export const getCategoryById = async (categoryId) => {
  if (!categoryId) {
    throw createHttpError(400, 'Invalid category ID format.');
  }

  const category = await CategoriesCollection.findById(categoryId)
    .select('_id name type')
    .lean();

  return category;
};
