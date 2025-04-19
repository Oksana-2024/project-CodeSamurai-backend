import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UsersCollection } from '../db/models/Users.js';

import { getEnvVar } from '../utils/getEnvVar.js';

export const findUserByEmail = (email) => UsersCollection.findOne({ email });

export const updateUserWithToken = (userId, email) => {
  const token = jwt.sign({ id: userId, email }, getEnvVar('JWT_SECRET'), {
    expiresIn: '1d',
  });

  return UsersCollection.findByIdAndUpdate(userId, { token }, { new: true });
};

export const createUser = async (userData) => {
  const encryptedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = await UsersCollection.create({
    ...userData,
    password: encryptedPassword,
  });

  return updateUserWithToken(newUser._id, newUser.email);
};

export const logoutUser = async (userId) => {
  return await UsersCollection.findByIdAndUpdate(
    userId,
    { token: null },
    { new: true },
  );
};
