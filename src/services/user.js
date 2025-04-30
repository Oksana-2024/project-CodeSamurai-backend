import { UsersCollection } from '../db/models/Users.js';

export const userProfile = async (id) => {
  const userProfile = await UsersCollection.findOne({ _id: id }).select('name email balance photo -_id');

  return userProfile;
};

export const updateUserProfile = async (id, payload) => {
  const updateProfile = await UsersCollection.findOneAndUpdate(
    { _id: id },
    payload,
    { new: true },
  ).select('name photo -_id');

  return updateProfile;
};
