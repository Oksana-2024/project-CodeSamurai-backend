import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

// import { authenticate } from '../middlewares/authenticate.js';

import {
  getAllCategoriesController,
  getCategoriesByTypeController,
} from '../controllers/categories.js';

const categoriesRouter = Router();
// categoriesRouter.use(authenticate);

categoriesRouter.get('/', ctrlWrapper(getAllCategoriesController));
categoriesRouter.get('/:type', ctrlWrapper(getCategoriesByTypeController));

export default categoriesRouter;
