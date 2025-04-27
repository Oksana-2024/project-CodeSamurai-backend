import createHttpError from 'http-errors';

import { TransactionsCollection } from '../db/models/Transactions.js';
import { UsersCollection } from '../db/models/Users.js';
import { CategoriesCollection } from '../db/models/Categories.js';

import { updateUserBalance } from '../utils/balanceUtil.js';

import { MINIMUM_YEAR } from '../constans/index.js';

export const getTransactions = async (userId) => {
  const transactions = await TransactionsCollection.find({ userId }).populate(
    'categoryId',
    'name',
  );

  return transactions;
};

export const getBalance = async (userId) => {
  const user = await UsersCollection.findById(userId).select('balance');
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  return user.balance;
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

  await updateUserBalance(userId);

  const createdAndPopulatedTransaction = await TransactionsCollection.findById(
    newTransaction._id,
  ).populate('categoryId', 'name');

  return createdAndPopulatedTransaction;
};

export const deleteTransactions = async (id, userId) => {
  const deletedTransaction = await TransactionsCollection.findOneAndDelete({
    _id: id,
    userId,
  }).populate('categoryId', 'name');

  if (!deletedTransaction) {
    return null;
  }

  await updateUserBalance(userId);

  return deletedTransaction;
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

  const updatedTransaction = await TransactionsCollection.findOneAndUpdate(
    { _id: id, userId },
    payload,
    { new: true },
  ).populate('categoryId', 'name');

  if (!updatedTransaction) {
    return null;
  }

  await updateUserBalance(userId);

  return updatedTransaction;
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

  const expenseCategoriesDocs = await CategoriesCollection.find({})
    .select('_id name')
    .lean();

  const categoryAmounts = {};
  expenseCategoriesDocs.forEach((cat) => {
    categoryAmounts[cat.name] = 0;
  });

  const transactions = await TransactionsCollection.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
  })

    .populate('categoryId', 'name')
    .lean();

  const user = await UsersCollection.findById(userId).select('balance').lean();
  const currentBalance = user ? user.balance : 0;

  const result = {
    totalBalance: currentBalance, // Поточний загальний баланс
    periodIncomeOutcome: 0, // Різниця між доходами та витратами за період
    totalIncome: 0, // Загальна сума доходів за період
    totalExpense: 0, // Загальна сума витрат за період
    categoryExpenses: {}, // Витрати по категоріях за період
    periodTransactions: 0, // Загальна сума всіх транзакцій (доходи + витрати) за період
  };

  let periodTotalAmount = 0;

  transactions.forEach((transaction) => {
    const { type, categoryId, sum } = transaction;

    periodTotalAmount += sum;

    if (type === 'income') {
      result.totalIncome += sum;
    } else if (type === 'expense') {
      result.totalExpense += sum;

      if (categoryId && categoryId.name) {
        const categoryName = categoryId.name;

        if (
          Object.prototype.hasOwnProperty.call(categoryAmounts, categoryName)
        ) {
          categoryAmounts[categoryName] += sum;
        }
      }
    }
  });

  result.periodIncomeOutcome = result.totalIncome - result.totalExpense;

  result.periodTransactions = periodTotalAmount;

  result.categoryExpenses = {};

  for (const categoryName in categoryAmounts) {
    if (
      Object.prototype.hasOwnProperty.call(categoryAmounts, categoryName) &&
      categoryAmounts[categoryName] > 0
    ) {
      result.categoryExpenses[categoryName] = parseFloat(
        categoryAmounts[categoryName].toFixed(2),
      );
    }
  }

  result.totalBalance = parseFloat(result.totalBalance.toFixed(2));
  result.periodIncomeOutcome = parseFloat(
    result.periodIncomeOutcome.toFixed(2),
  );
  result.periodTransactions = parseFloat(result.periodTransactions.toFixed(2));
  result.totalIncome = parseFloat(result.totalIncome.toFixed(2));
  result.totalExpense = parseFloat(result.totalExpense.toFixed(2));

  return result;
};
