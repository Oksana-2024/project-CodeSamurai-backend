import { Router } from 'express';

import { updateUserProfileSchema } from '../validation/user.js';

import {
  userProfileController,
  updateUserProfileController,
} from '../controllers/user.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidID.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const currentUsersRouter = Router();

currentUsersRouter.use(authenticate);

currentUsersRouter.get('/current', ctrlWrapper(userProfileController));

currentUsersRouter.patch(
  '/current',
  isValidId,
  upload.single('photo'),
  validateBody(updateUserProfileSchema),
  ctrlWrapper(updateUserProfileController),
);

export default currentUsersRouter;
