import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { loginUser, registerUser } from '../services/auth';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({ user: user.name, email: user.email });
};

export const loginUserController = async (req, res) => {
  const user = await loginUser(req.body);

  res.json({
    user: {},
    // token: '',
  });
};

export const logoutUserController = async (req, res) => {};
