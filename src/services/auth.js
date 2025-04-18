import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

import { UsersCollection } from '../db/models/Users';

// import { getEnvVar } from '../utils/getEnvVar.js';

export const registerUser = async (userData) => {
  const user = await UsersCollection.findOne({ email: userData.email });

  if (user)
    throw createHttpError(
      409,
      'This email address is already in use. Please try another one',
    );

  const encryptedPassword = await bcrypt.hash(userData.password, 10);

  return await UsersCollection.create({
    ...userData,
    password: encryptedPassword,
  });
};

export const loginUser = async (userData) => {
  const user = await UsersCollection.findOne({ email: userData.email });

  if (!user)
    throw createHttpError(
      401,
      'User is not found. Please check the email or sign up for a new account.',
    );

  const isPwdEqual = await bcrypt.compare(userData.password, user.password);

  if (!isPwdEqual) throw createHttpError(401, 'Email or password is incorrect');

  //   const token = jwt.sign(
  //     { id: user._id, email: user.email },
  //     getEnvVar('JWT_SECRET'),
  //     { expiresIn: '1d' },
  //   );

  //   return await UsersCollection.findByIdAndUpdate(
  //     user._id,
  //     { token },
  //     { new: true },
  //   );
};

export const logoutUser = async (userId) => {
  return await UsersCollection.findByIdAndUpdate(
    userId,
    { token: null },
    { new: true },
  );
};
