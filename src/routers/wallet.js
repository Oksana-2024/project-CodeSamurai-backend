import { Router } from 'express';

import {
  getTransactionsController,
  createTransactionsController,
  updateTransactionsController,
  deleteTransactionsController,
  getBalanceController,
  getTransactionsByPeriodController,
} from '../controllers/wallet.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { isValidId } from '../middlewares/isValidID.js';
import { validateBody } from '../middlewares/validateBody.js';

import {
  createTransactionsSchema,
  updateTransactionsSchema,
} from '../validation/wallet.js';

import { authenticate } from '../middlewares/authenticate.js';

const transactionsRouter = Router();

transactionsRouter.use(authenticate);

transactionsRouter.get('/', ctrlWrapper(getTransactionsController));

transactionsRouter.post(
  '/',
  validateBody(createTransactionsSchema),
  ctrlWrapper(createTransactionsController),
);

transactionsRouter.patch(
  '/:id',
  isValidId,
  validateBody(updateTransactionsSchema),
  ctrlWrapper(updateTransactionsController),
);

transactionsRouter.delete(
  '/:id',
  isValidId,
  ctrlWrapper(deleteTransactionsController),
);

transactionsRouter.get('/balance', ctrlWrapper(getBalanceController));

transactionsRouter.get('/statistics', ctrlWrapper(getTransactionsByPeriodController));

export default transactionsRouter;
