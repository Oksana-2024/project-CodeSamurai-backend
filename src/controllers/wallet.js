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

  const balance = await getBalance(userId);

  res.status(200).json({
    status: 200,
    message: 'Successfully found transactions!',
    data: {
      transactions,
      balance,
    },
  });
};

export const createTransactionsController = async (req, res) => {
  const { _id: userId } = req.user;
  const payload = req.body;

  const transaction = await createTransactions(userId, payload);

  const balance = await getBalance(userId);

  res.status(201).json({
    status: 201,
    message: 'Successfully created transactions!',
    data: {
      transaction,
      balance,
    },
  });
};

export const deleteTransactionsController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  const deletedTransaction = await deleteTransactions(id, userId);

  if (!deletedTransaction) {
    throw createHttpError(404, 'Transaction not found!');
  }

  const balance = await getBalance(userId);

  res.status(200).json({
    status: 200,
    message: 'Successfully deleted transaction!',
    data: {
      balance,
    },
  });
};

export const updateTransactionsController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const payload = req.body;

  const transaction = await updateTransactions(id, payload, userId);

  if (!transaction) {
    throw createHttpError(404, 'Transaction not found!');
  }

  const balance = await getBalance(userId);

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a user transaction!',
    data: {
      transaction,
      balance,
    },
  });
};

export const getBalanceController = async (req, res) => {
  const { _id: userId } = req.user;

  const balance = await getBalance(userId);

  res.status(200).json({
    status: 200,
    message: 'Successfully found user balance!',
    data: { balance },
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
  if (isNaN(yearNum)) {
    throw createHttpError(400, 'Invalid year value');
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (yearNum < 2022) {
    throw createHttpError(400, `Year must be 2022 or later.`);
  }
  if (
    yearNum > currentYear ||
    (yearNum === currentYear && monthNum > currentMonth)
  ) {
    throw createHttpError(400, 'Period cannot be in the future.');
  }

  const result = await getTransactionsByPeriod(userId, yearNum, monthNum);

  const formattedMonth = monthNum.toString().padStart(2, '0');
  const period = `${yearNum}-${formattedMonth}`;

  res.status(200).json({
    status: 200,
    message: `Successfully found transactions for period ${period}!`,
    data: result,
  });
};
