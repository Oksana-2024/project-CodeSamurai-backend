import createHttpError from 'http-errors';

import { userProfile, updateUserProfile } from '../services/user.js';

import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const userProfileController = async (req, res) => {
  const { id } = req.params;

  const profile = await userProfile(id);

  res.status(200).json({
    status: 200,
    message: 'Successfully fetched a user profile!',
    data: profile,
  });
};

export const updateUserProfileController = async (req, res) => {
  const { id } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const updatedProfile = await updateUserProfile(id, {
    ...req.body,
    photo: photoUrl,
  });

  if (!updatedProfile) throw createHttpError(404, 'User profile not found!');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a user profile!',
    data: updatedProfile,
  });
};
