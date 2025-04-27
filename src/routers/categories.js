import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';

import { getAllCategoriesController } from '../controllers/categories.js';

const categoriesRouter = Router();

categoriesRouter.use(authenticate);

categoriesRouter.get('/', ctrlWrapper(getAllCategoriesController));

export default categoriesRouter;
