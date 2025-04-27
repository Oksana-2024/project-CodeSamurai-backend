import createHttpError from 'http-errors';

import { getCategoryById } from '../services/categories.js';

export const getCategoryByIdController = async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await getCategoryById(categoryId);

  if (!category) {
    throw createHttpError(404, `Category with ID ${categoryId} not found!`);
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found category with ID ${categoryId}!`,
    data: category,
  });
};
