import { Router } from 'express';

import { registerUserSchema, loginUserSchema } from '../validation/auth.js';

import { validateBody } from '../utils/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  registerUserController,
  loginUserController,
  logoutUserController,
} from '../controllers/auth.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.use(authenticate);

router.post('/logout', ctrlWrapper(logoutUserController));

export default router;

// GET '/user',
//? additional task
// PATCH '/user',
