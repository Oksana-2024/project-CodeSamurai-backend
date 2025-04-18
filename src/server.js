import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { getEnvVar } from './utils/getEnvVar.js';
import { notFoundHandler } from './midllewares/notFoundHandler.js';
import { errorHandler } from './midllewares/errorHandler.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const startServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  // app.use('/auth');
  // app.use('/wallet');
  app.use(errorHandler);
  app.all(/.*/, notFoundHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
