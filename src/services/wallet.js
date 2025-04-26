import createHttpError from 'http-errors';

import { TransactionsCollection } from '../db/models/Transactions.js';
import { UsersCollection } from '../db/models/Users.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getTransactions = async (
  userId,
  { page = 1, perPage = 8, sortOrder = 'desc' } = {},
) => {
  const skip = (page - 1) * perPage;

  const [transactions, totalCount] = await Promise.all([
    TransactionsCollection.find({ userId })
      .sort({ date: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(perPage),
    TransactionsCollection.countDocuments({ userId }),
  ]);

  const pageInfo = calculatePaginationData(page, perPage, totalCount);

  return {
    transactions,
    pageInfo,
  };
};

export const getBalance = async (userId) => {
  const user = await UsersCollection.findById(userId).select('balance');
  return user.balance;
};

export const createTransactions = async (userId, payload) => {
  const transactionData = {
    userId,
    ...payload,
  };

  const newTransaction = await TransactionsCollection.create(transactionData);
  const transactionSum = newTransaction.sum;
  const transactionType = newTransaction.type;

  const user = await UsersCollection.findById(userId);

  if (!user) throw createHttpError(404, 'User not found!');

  let balanceChange = transactionSum;

  if (transactionType === 'expense') {
    balanceChange = -balanceChange;
  }

  const updateResult = await UsersCollection.updateOne(
    { _id: userId },
    { $inc: { balance: balanceChange } },
  );

  if (updateResult.matchedCount === 0)
    throw createHttpError(404, 'User not found!');
  if (updateResult.modifiedCount === 0)
    throw createHttpError(400, 'Failed to update user balance!');

  return newTransaction;
};

export const deleteTransactions = async (id, userId) => {
  const transaction = await TransactionsCollection.findOneAndDelete({
    _id: id,
    userId,
  });

  if (!transaction) {
    return null;
  }

  const transactionAmount = transaction.sum;

  const updatedUser = await UsersCollection.findOneAndUpdate(
    { _id: userId },
    { $inc: { balance: -transactionAmount } },
    { new: true },
  );

  if (!updatedUser) throw createHttpError(404, 'User not found!');

  return transaction;
};

export const updateTransactions = async (id, payload, userId) => {
  // Спочатку отримаємо поточну транзакцію, щоб знати її початкові значення
  const oldTransaction = await TransactionsCollection.findOne({
    _id: id,
    userId,
  });

  if (!oldTransaction) {
    return null;
  }

  // Оновлюємо транзакцію
  const updatedTransaction = await TransactionsCollection.findOneAndUpdate(
    { _id: id, userId },
    payload,
    { new: true },
  );

  // Якщо сума або тип транзакції змінились, потрібно оновити баланс
  if (payload.sum !== undefined || payload.type !== undefined) {
    let balanceAdjustment = 0;

    // Спочатку скасуємо вплив старої транзакції на баланс
    if (oldTransaction.type === 'income') {
      balanceAdjustment -= oldTransaction.sum;
    } else if (oldTransaction.type === 'expense') {
      balanceAdjustment += oldTransaction.sum;
    }

    // Потім додаємо вплив нової (оновленої) транзакції
    const transactionType = payload.type || oldTransaction.type;
    const transactionSum =
      payload.sum !== undefined ? payload.sum : oldTransaction.sum;

    if (transactionType === 'income') {
      balanceAdjustment += transactionSum;
    } else if (transactionType === 'expense') {
      balanceAdjustment -= transactionSum;
    }

    // Оновлюємо баланс користувача
    if (balanceAdjustment !== 0) {
      await UsersCollection.findByIdAndUpdate(
        userId,
        { $inc: { balance: balanceAdjustment } },
        { new: true },
      );
    }
  }

  return updatedTransaction;
};

export const getTransactionsByPeriod = async (userId, period) => {
  // Розбиваємо період на рік і місяць
  const [year, month] = period.split('-').map(Number);

  // Визначаємо перший і останній день місяця
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  // Отримуємо всі транзакції користувача за вказаний період
  const transactions = await TransactionsCollection.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
  }).lean();

  // Підготовка результату
  const result = {
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    categoryExpenses: {},
    periodType: determinePeriodType(year, month),
  };

  // Створюємо об'єкт для зберігання витрат по кожній категорії
  const categoryAmounts = {};
  const expenseCategories = [
    'main expenses',
    'products',
    'car',
    'self care',
    'child care',
    'household products',
    'education',
    'leisure',
    'other expenses',
    'entertainment',
  ];

  // Ініціалізуємо категорії з нульовими значеннями
  expenseCategories.forEach((category) => {
    categoryAmounts[category] = 0;
  });

  // Аналізуємо та агрегуємо дані транзакцій
  transactions.forEach((transaction) => {
    const { type, category, sum } = transaction;

    if (type === 'income') {
      result.totalIncome += sum;
    } else if (type === 'expense') {
      result.totalExpense += sum;

      // Додаємо суму до відповідної категорії витрат
      if (category in categoryAmounts) {
        categoryAmounts[category] += sum;
      }
    }
  });

  // Обчислюємо загальний баланс
  result.totalBalance = result.totalIncome - result.totalExpense;

  // Формуємо відформатовані дані про витрати за категоріями
  result.categoryExpenses = {};
  for (const category in categoryAmounts) {
    if (categoryAmounts[category] > 0) {
      result.categoryExpenses[category] = parseFloat(
        categoryAmounts[category].toFixed(2),
      );
    }
  }

  // Заокруглюємо всі суми до двох знаків після коми для зручності
  result.totalBalance = parseFloat(result.totalBalance.toFixed(2));
  result.totalIncome = parseFloat(result.totalIncome.toFixed(2));
  result.totalExpense = parseFloat(result.totalExpense.toFixed(2));

  return result;
};

const determinePeriodType = (year, month) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'past';
  } else if (year === currentYear && month === currentMonth) {
    return 'current';
  } else {
    return 'future';
  }
};
