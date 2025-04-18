import createHttpError from 'http-errors';

import { UsersCollection } from '../db/models/Users.js';

import { getEnvVar } from '../utils/getEnvVar.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'Access token is missing or invalid'));
  }

  const token = authHeader.split(' ')[1];

  const decodedUser = jwt.verify(token, getEnvVar('JWT_SECRET'));
  const user = await UsersCollection.findById(decodedUser.id);

  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }
  req.user = user;

  next();
};
