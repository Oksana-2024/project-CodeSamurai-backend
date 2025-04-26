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

const currentsRouter = Router();

currentsRouter.use(authenticate);

currentsRouter.get('/', ctrlWrapper(userProfileController));

currentsRouter.patch(
  '/:id',
  isValidId,
  upload.single('photo'),
  validateBody(updateUserProfileSchema),
  ctrlWrapper(updateUserProfileController),
);

export default currentsRouter;
