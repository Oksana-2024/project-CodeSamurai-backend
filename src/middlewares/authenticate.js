import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

// import { UsersCollection } from '../db/models/Users.js';

import { getEnvVar } from '../utils/getEnvVar.js';
import { SessionsCollection } from '../db/models/Sessions.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'Access token is missing or invalid'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));

    const session = await SessionsCollection.findOne({
      userId: decoded.id,
      token,
    });

    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }

    req.user = { _id: decoded.id, email: decoded.email };

    next();
  } catch (error) {
    console.log(error);
    return next(createHttpError(401, 'Invalid or expired token'));
  }
};
