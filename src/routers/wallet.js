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

// import { authenticate } from '../middlewares/authenticate.js';

const walletRouter = Router();

// walletRouter.use(authenticate);

walletRouter.get('/transactions', ctrlWrapper(getTransactionsController));

walletRouter.post(
  '/transactions',
  validateBody(createTransactionsSchema),
  ctrlWrapper(createTransactionsController),
);

walletRouter.patch(
  '/transactions/:id',
  isValidId,
  validateBody(updateTransactionsSchema),
  ctrlWrapper(updateTransactionsController),
);

walletRouter.delete(
  '/transactions/:id',
  isValidId,
  ctrlWrapper(deleteTransactionsController),
);

walletRouter.get('/balance', ctrlWrapper(getBalanceController));

walletRouter.get('/statistics', ctrlWrapper(getTransactionsByPeriodController));

export default walletRouter;
