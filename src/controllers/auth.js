import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

import {
  logoutUser,
  findUserByEmail,
  createUser,
  updateUserWithToken,
} from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const user = await findUserByEmail(req.body.email);

  if (user)
    throw createHttpError(
      409,
      'This email address is already in use. Please try another one',
    );

  const newUser = await createUser(req.body);

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
    },
    token: newUser.token,
  });
};

export const loginUserController = async (req, res) => {
  const user = await findUserByEmail(req.body.email);

  if (!user) {
    throw createHttpError(
      401,
      'User is not found. Please check the email or sign up for a new account.',
    );
  }

  const isPwdEqual = await bcrypt.compare(req.body.password, user.password);

  if (!isPwdEqual) throw createHttpError(401, 'Email or password is incorrect');

  const updatedUser = await updateUserWithToken(user._id, user.email);

  res.status(200).json({
    user: { name: updatedUser.name, email: updatedUser.email },
    token: updatedUser.token,
  });
};

export const logoutUserController = async (req, res) => {
  await logoutUser(req.user._id);

  res.status(204).send();
};
