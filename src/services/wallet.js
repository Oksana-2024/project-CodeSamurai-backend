import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import { TransactionsCollection } from '../db/models/Transactions.js';
import { UsersCollection } from '../db/models/Users.js';
import { CategoriesCollection } from '../db/models/Categories.js';

import { MINIMUM_YEAR } from '../constans/index.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import {
  updateBalanceOnCreate,
  updateBalanceOnUpdate,
  updateBalanceOnDelete,
} from '../utils/balanceUtil.js';

const EXCLUDE_FIELDS = '-userId -createdAt -updatedAt -__v';

export const getTransactions = async (
  userId,
  { page = 1, perPage = 8, sortOrder = 'desc' } = {},
) => {
  const skip = (page - 1) * perPage;

  const [transactions, totalCount] = await Promise.all([
    TransactionsCollection.find({ userId })
      .sort({ date: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(perPage)
      .select(EXCLUDE_FIELDS)
      .populate('categoryId', 'name'),
    TransactionsCollection.countDocuments({ userId }),
  ]);

  const pageInfo = calculatePaginationData(page, perPage, totalCount);

  return {
    transactions,
    pageInfo,
  };
};

export const createTransactions = async (userId, payload) => {
  const user = await UsersCollection.findById(userId);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const category = await CategoriesCollection.findById(payload.categoryId);
  if (!category) {
    throw createHttpError(404, 'Category not found!');
  }

  const transactionData = {
    userId,
    ...payload,
  };

  const newTransaction = await TransactionsCollection.create(transactionData);

  const balance = await updateBalanceOnCreate(userId, payload);

  const createdAndPopulatedTransaction = await TransactionsCollection.findById(
    newTransaction._id,
  )
    .select(EXCLUDE_FIELDS + ' -_id')
    .populate('categoryId', 'name');

  return {
    transaction: createdAndPopulatedTransaction,
    balance,
  };
};

export const deleteTransactions = async (id, userId) => {
  const transaction = await TransactionsCollection.findOne({
    _id: id,
    userId,
  })
    .select(EXCLUDE_FIELDS)
    .populate('categoryId', 'name');

  if (!transaction) {
    return null;
  }

  const balance = await updateBalanceOnDelete(userId, transaction);

  await TransactionsCollection.findByIdAndDelete(id);

  return {
    transaction,
    balance,
  };
};

export const updateTransactions = async (id, payload, userId) => {
  const oldTransaction = await TransactionsCollection.findOne({
    _id: id,
    userId,
  });

  if (!oldTransaction) {
    return null;
  }

  if (payload.categoryId) {
    const category = await CategoriesCollection.findById(payload.categoryId);
    if (!category) {
      throw createHttpError(404, 'Category not found!');
    }
  }

  const balance = await updateBalanceOnUpdate(userId, oldTransaction, {
    ...oldTransaction.toObject(),
    ...payload,
  });

  const updatedTransaction = await TransactionsCollection.findOneAndUpdate(
    { _id: id, userId },
    payload,
    { new: true },
  )
    .select(EXCLUDE_FIELDS)
    .populate('categoryId', 'name');

  return {
    transaction: updatedTransaction,
    balance,
  };
};

export const getTransactionsByPeriod = async (userId, year, month) => {
  if (year < MINIMUM_YEAR) {
    throw createHttpError(
      400,
      `Data available only from ${MINIMUM_YEAR}. Requested year is ${year}.`,
    );
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year > currentYear || (year === currentYear && month > currentMonth)) {
    throw createHttpError(400, 'Period cannot be in the future.');
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const userObjectId =
    typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

  const result = await TransactionsCollection.aggregate([
    {
      $match: {
        userId: userObjectId,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $facet: {
        summary: [
          {
            $group: {
              _id: '$type',
              total: { $sum: '$sum' },
            },
          },
        ],

        categories: [
          {
            $lookup: {
              from: 'categories',
              localField: 'categoryId',
              foreignField: '_id',
              as: 'category',
            },
          },
          {
            $unwind: {
              path: '$category',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: {
                categoryId: '$categoryId',
                type: '$type',
                categoryName: '$category.name',
              },
              total: { $sum: '$sum' },
            },
          },
          {
            $project: {
              _id: 0,
              type: '$_id.type',
              categoryId: '$_id.categoryId',
              categoryName: '$_id.categoryName',
              total: 1,
            },
          },
        ],

        transactionsCount: [
          {
            $count: 'count',
          },
        ],
      },
    },
  ]);

  const user = await UsersCollection.findById(userId).select('balance').lean();
  const currentBalance = user ? user.balance : 0;

  const [stats] = result;

  const totalIncome = stats.summary.find((x) => x._id === 'income')?.total || 0;
  const totalExpense =
    stats.summary.find((x) => x._id === 'expense')?.total || 0;

  const categoryExpenses = {};
  stats.categories
    .filter(
      (cat) => cat.type === 'expense' && cat.total > 0 && cat.categoryName,
    )
    .forEach((cat) => {
      categoryExpenses[cat.categoryName] = parseFloat(cat.total.toFixed(2));
    });

  const response = {
    totalBalance: parseFloat(currentBalance.toFixed(2)),
    periodIncomeOutcome: parseFloat((totalIncome - totalExpense).toFixed(2)),
    totalIncome: parseFloat(totalIncome.toFixed(2)),
    totalExpense: parseFloat(totalExpense.toFixed(2)),
    categoryExpenses,
    periodTransactions: parseFloat(
      (Math.abs(totalIncome) + Math.abs(totalExpense)).toFixed(2),
    ),
  };

  return response;
};
