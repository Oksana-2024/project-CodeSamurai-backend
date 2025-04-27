import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { getCategoryByIdController } from '../controllers/categories.js';

const categoriesRouter = Router();

categoriesRouter.get('/:categoryId', ctrlWrapper(getCategoryByIdController));

export default categoriesRouter;
