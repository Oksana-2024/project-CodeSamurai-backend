import createHttpError from 'http-errors';
import {
  createTransactions,
  deleteTransactions,
  getTransactions,
  updateTransactions,
  getTransactionsByPeriod,
} from '../services/wallet.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getTransactionsController = async (req, res) => {
  const { _id: userId } = req.user;

  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder } = parseSortParams(req.query);

  const { transactions, pageInfo } = await getTransactions(userId, {
    page,
    perPage,
    sortOrder,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found transactions!',
    transactions,
    pageInfo,
  });
};

export const createTransactionsController = async (req, res) => {
  const { _id: userId } = req.user;
  const payload = req.body;

  const { transaction, balance } = await createTransactions(userId, payload);

  res.status(201).json({
    status: 201,
    message: 'Successfully created transactions!',
    transaction,
    balance,
  });
};

export const deleteTransactionsController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  const result = await deleteTransactions(id, userId);

  if (!result) {
    throw createHttpError(404, 'Transaction not found!');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully deleted transaction!',
    balance: result.balance,
  });
};

export const updateTransactionsController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const payload = req.body;

  const result = await updateTransactions(id, payload, userId);

  if (!result) {
    throw createHttpError(404, 'Transaction not found!');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a user transaction!',
    transaction: result.transaction,
    balance: result.balance,
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

  const result = await getTransactionsByPeriod(userId, yearNum, monthNum);

  const formattedMonth = monthNum.toString().padStart(2, '0');
  const period = `${yearNum}-${formattedMonth}`;

  res.status(200).json({
    status: 200,
    message: `Successfully found transactions for period ${period}!`,
    period,
    ...result,
  });
};
