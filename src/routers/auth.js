import { Router } from 'express';

import { registerUserSchema, loginUserSchema } from '../validation/auth.js';

import { validateBody } from '../utils/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  registerUserController,
  loginUserController,
  logoutUserController,
} from '../controllers/auth.js';
import { authenticate } from '../midllewares/authenticate.js';

const router = Router();

router.use(authenticate);

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);
router.post(
  '/auth/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);
router.post('/auth/logout', ctrlWrapper(logoutUserController));

export default router;

// GET '/user',
//? additional task
// PATCH '/user',
