import createHttpError from 'http-errors';

import {
  createTransactions,
  deleteTransactions,
  getTransactions,
  updateTransactions,
  getBalance,
  getTransactionsByPeriod,
} from '../services/wallet.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getTransactionsController = async (req, res) => {
  const { _id: userId } = req.user;

  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder } = parseSortParams(req.query);

  const transactions = await getTransactions(userId, {
    page,
    perPage,
    sortOrder,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found transactions!',
    data: transactions,
  });
};

export const createTransactionsController = async (req, res) => {
  const { _id: userId } = req.user;
  const payload = req.body;

  const transactions = await createTransactions(userId, payload);

  res.status(201).json({
    status: 201,
    message: 'Successfully created transactions!',
    data: transactions,
  });
};

export const deleteTransactionsController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  const transactions = await deleteTransactions(id, userId);

  if (!transactions) throw createHttpError(404, 'User transactions not found!');

  res.status(204).send();
};

export const updateTransactionsController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  const transactions = await updateTransactions(id, { ...req.body }, userId);

  if (!transactions) throw createHttpError(404, 'User transactions not found!');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a user transactions!',
    data: transactions,
  });
};

export const getBalanceController = async (req, res) => {
  const { _id: userId } = req.user;

  const user = await getBalance(userId);

  if (!user) throw createHttpError(404, 'User not found!');

  res.status(200).json({
    status: 200,
    message: 'Successfully found a user balance!',
    data: user,
  });
};

export const getTransactionsByPeriodController = async (req, res) => {
  const { month, year } = req.query;
  const { _id: userId } = req.user;

  if (!month || !year) {
    throw createHttpError(400, 'Month and year parameters are required');
  }

  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    throw createHttpError(
      400,
      'Invalid month value. Should be between 1 and 12',
    );
  }

  if (isNaN(yearNum) || yearNum < 2020 || yearNum > 2030) {
    throw createHttpError(400, 'Invalid year value');
  }

  const formattedMonth = monthNum.toString().padStart(2, '0');
  const period = `${yearNum}-${formattedMonth}`;

  const result = await getTransactionsByPeriod(userId, period);

  res.status(200).json({
    status: 200,
    message: 'Successfully found transactions for this period!',
    data: result,
  });
};
