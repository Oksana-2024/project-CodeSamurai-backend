import { TransactionsCollection } from '../db/models/Transactions.js';
import { UsersCollection } from '../db/models/Users.js';
import createHttpError from 'http-errors';

export const recalculateUserBalance = async (userId) => {
  const user = await UsersCollection.findById(userId);

  const transactions = await TransactionsCollection.find({ userId: user._id });

  const calculatedBalance = transactions.reduce((total, transaction) => {
    return total + Number(transaction.sum);
  }, 0);

  const formattedBalance = parseFloat(calculatedBalance.toFixed(2));

  const updatedUser = await UsersCollection.findByIdAndUpdate(
    userId,
    { balance: formattedBalance },
    { new: true },
  );

  if (!updatedUser) {
    throw createHttpError(500, 'Failed to update user balance!');
  }

  return formattedBalance;
};

export const updateUserBalance = async (userId) => {
  return await recalculateUserBalance(userId);
};
