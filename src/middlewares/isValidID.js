import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export function isValidId(req, res, next) {
  const id = req.params.id;

  if (!isValidObjectId(id)) {
    throw createHttpError(400, `${id} is not valid id`);
  }

  next();
}
