import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UsersCollection } from '../db/models/Users.js';
import { SessionsCollection } from '../db/models/Sessions.js';

import { getEnvVar } from '../utils/getEnvVar.js';

import { TOKEN_VALID_UNTIL } from '../constans/index.js';

export const createSession = async (userId, email) => {
  const token = jwt.sign({ id: userId, email }, getEnvVar('JWT_SECRET'), {
    expiresIn: '1d',
  });

  await SessionsCollection.create({
    userId,
    token,
    tokenValidUntil: new Date(Date.now() + TOKEN_VALID_UNTIL),
  });

  return token;
};

export const findUserByEmail = (email) => UsersCollection.findOne({ email });

export const createUser = async (userData) => {
  const encryptedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = await UsersCollection.create({
    ...userData,
    password: encryptedPassword,
  });

  const token = await createSession(newUser._id, newUser.email);

  return { user: newUser, token };
};

export const logoutUser = async (userId) => {
  await SessionsCollection.deleteOne({ userId });
};
