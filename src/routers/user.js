import { Router } from 'express';

import { updateUserProfileSchema } from '../validation/user.js';

import {
  userProfileController,
  updateUserProfileController,
} from '../controllers/user.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get('/current', ctrlWrapper(userProfileController));

usersRouter.patch(
  '/current',
  upload.single('photo'),
  validateBody(updateUserProfileSchema),
  ctrlWrapper(updateUserProfileController),
);

export default usersRouter;
