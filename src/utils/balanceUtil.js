import { TransactionsCollection } from '../db/models/Transactions.js';
import { UsersCollection } from '../db/models/Users.js';
import createHttpError from 'http-errors';

export const recalculateUserBalance = async (userId) => {
  const user = await UsersCollection.findById(userId);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const result = await TransactionsCollection.aggregate([
    { $match: { userId: user._id } },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$sum' },
      },
    },
  ]);

  let calculatedBalance = result.length > 0 ? result[0].totalAmount : 0;

  calculatedBalance = parseFloat(calculatedBalance.toFixed(2));

  const updatedUser = await UsersCollection.findByIdAndUpdate(
    userId,
    { balance: calculatedBalance },
    { new: true },
  );

  if (!updatedUser) {
    throw createHttpError(500, 'Failed to update user balance!');
  }

  console.log(`Updated balance for user ${userId}: ${calculatedBalance}`);

  return calculatedBalance;
};

export const updateUserBalance = async (userId) => {
  return await recalculateUserBalance(userId);
};
