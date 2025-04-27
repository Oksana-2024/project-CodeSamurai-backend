import { CategoriesCollection } from '../db/models/Categories.js';
import { DEFAULT_CATEGORIES } from '../constans/index.js';

export const initializeDefaultCategories = async () => {
  try {
    const count = await CategoriesCollection.countDocuments();

    if (count === 0) {
      console.log('Initializing default categories...');

      const defaultCategoryObjects = DEFAULT_CATEGORIES.map((name) => ({
        name,
      }));

      await CategoriesCollection.insertMany(defaultCategoryObjects);

      console.log('Default categories have been initialized successfully.');
    } else {
      console.log('Categories already exist, skipping initialization.');
    }
  } catch (error) {
    console.error('Failed to initialize default categories:', error);

    throw error;
  }
};
