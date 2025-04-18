import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { UsersCollection } from '../db/models/Users';

export const registerUser = async (userData) => {
  const user = await UsersCollection.findOne({ email: userData.email });

  if (user)
    throw createHttpError(
      409,
      'This email address is already in use. Please try another one',
    );

  const encryptedPassword = bcrypt.hash(userData.password, 10);

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

  // створення сесії чи апдейт юзера
};
