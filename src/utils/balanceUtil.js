import { UsersCollection } from '../db/models/Users.js';
import { TransactionsCollection } from '../db/models/Transactions.js';
import createHttpError from 'http-errors';

export const updateBalanceOnCreate = async (userId, transaction) => {
  const user = await UsersCollection.findById(userId);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const sum = Number(transaction.sum);

  if (transaction.type === 'income') {
    user.balance = Number(user.balance) + sum;
  } else {
    user.balance = Number(user.balance) - sum;
  }

  user.balance = parseFloat(user.balance.toFixed(2));
  await user.save();

  return user.balance;
};

export const updateBalanceOnUpdate = async (
  userId,
  oldTransaction,
  newTransaction,
) => {
  const user = await UsersCollection.findById(userId);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  if (Number(newTransaction.sum) !== Number(oldTransaction.sum)) {
    const oldSum = Number(oldTransaction.sum);
    const newSum = Number(newTransaction.sum);
    const sumChange = newSum - oldSum;

    if (oldTransaction.type === 'income') {
      user.balance = Number(user.balance) + sumChange;
    } else {
      user.balance = Number(user.balance) - sumChange;
    }

    user.balance = parseFloat(user.balance.toFixed(2));
    await user.save();
  }

  return user.balance;
};

export const updateBalanceOnDelete = async (userId, transaction) => {
  const user = await UsersCollection.findById(userId);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const sum = Number(transaction.sum);

  if (transaction.type === 'income') {
    user.balance = Number(user.balance) - sum;
  } else {
    user.balance = Number(user.balance) + sum;
  }

  user.balance = parseFloat(user.balance.toFixed(2));
  await user.save();

  return user.balance;
};

export const recalculateBalance = async (userId) => {
  const user = await UsersCollection.findById(userId);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const transactions = await TransactionsCollection.find({ userId });

  let balance = 0;

  transactions.forEach((transaction) => {
    const sum = Number(transaction.sum);

    if (transaction.type === 'income') {
      balance += sum;
    } else {
      balance -= sum;
    }
  });

  user.balance = parseFloat(balance.toFixed(2));
  await user.save();

  return user.balance;
};
