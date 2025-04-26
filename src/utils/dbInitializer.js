import { CategoriesCollection } from '../db/models/Categories.js';
import { TRANSACTION_TYPES, DEFAULT_CATEGORIES } from '../constans/index.js';

export const initializeDefaultCategories = async () => {
  try {
    const existingCategories = await CategoriesCollection.find();
    if (existingCategories.length === 0) {
      console.log('Initializing default categories...');

      const categoryPromises = [];

      DEFAULT_CATEGORIES[TRANSACTION_TYPES.INCOME].forEach((name) => {
        categoryPromises.push(
          CategoriesCollection.create({
            type: TRANSACTION_TYPES.INCOME,
            name,
          }),
        );
      });

      DEFAULT_CATEGORIES[TRANSACTION_TYPES.EXPENSE].forEach((name) => {
        categoryPromises.push(
          CategoriesCollection.create({
            type: TRANSACTION_TYPES.EXPENSE,
            name,
          }),
        );
      });

      await Promise.all(categoryPromises);
      console.log('Default categories have been initialized');
    } else {
      console.log('Categories already exist, skipping initialization');
    }
  } catch (error) {
    console.error('Failed to initialize default categories:', error);
    throw error;
  }
};
