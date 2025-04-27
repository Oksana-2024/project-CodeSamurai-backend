import { CategoriesCollection } from '../db/models/Categories.js';

export const getAllCategories = async () => {
  const categories = await CategoriesCollection.find()
    .select('_id name')
    .lean();

  return categories;
};
