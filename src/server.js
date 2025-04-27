import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import currentUsersRouter from './routers/user.js';
import transactionsRouter from './routers/wallet.js';
import categoriesRouter from './routers/categories.js';

import { UPLOAD_DIR } from './constans/index.js';

import { getEnvVar } from './utils/getEnvVar.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

import authRouter from './routers/auth.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const startServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.use('/transactions', transactionsRouter);
  app.use('/categories', categoriesRouter);
  app.use('/currentUsers', currentUsersRouter);
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());
  app.use('/auth', authRouter);

  app.use('/api-docs', swaggerDocs());

  app.use(errorHandler);
  app.all(/.*/, notFoundHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
