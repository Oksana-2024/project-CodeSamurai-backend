import {
  getAllCategories,
  getCategoriesByType,
} from '../services/categories.js';

export const getAllCategoriesController = async (req, res) => {
  const categories = await getAllCategories();

  res.status(200).json({
    status: 200,
    message: 'Successfully found categories!',
    data: categories,
  });
};

export const getCategoriesByTypeController = async (req, res) => {
  const { type } = req.params;
  const result = await getCategoriesByType(type);

  res.status(200).json({
    status: 200,
    message: 'Successfully found categories by type!',
    data: result,
  });
};
