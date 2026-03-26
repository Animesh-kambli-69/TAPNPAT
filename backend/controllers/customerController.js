const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Ride = require('../models/Ride');
const { TRANSACTION_TYPES, TRANSACTION_STATUS } = require('../config/constants');

exports.getWallet = async (req, res) => {
  try {
    const customerId = req.user.id;

    const wallet = await Wallet.findOne({ userId: customerId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found.',
      });
    }

    res.json({
      success: true,
      data: {
        balance: wallet.balance,
        currency: wallet.currency,
        lastUpdated: wallet.lastUpdated,
        totalCredit: wallet.totalCredit,
        totalDebit: wallet.totalDebit,
        isBlocked: wallet.isBlocked,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet.',
      error: error.message,
    });
  }
};

exports.topupWallet = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount.',
      });
    }

    const wallet = await Wallet.findOne({ userId: customerId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found.',
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      walletId: wallet._id,
      userId: customerId,
      amount,
      type: TRANSACTION_TYPES.TOPUP,
      status: TRANSACTION_STATUS.COMPLETED,
      description: 'Wallet top-up',
    });

    // Update wallet balance
    wallet.balance += amount;
    wallet.totalCredit += amount;
    wallet.addTransaction({
      id: transaction._id,
      amount,
      type: TRANSACTION_TYPES.TOPUP,
    });
    await wallet.save();

    res.status(201).json({
      success: true,
      message: 'Top-up successful.',
      data: {
        balance: wallet.balance,
        transaction: transaction._id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Top-up failed.',
      error: error.message,
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { page = 1, limit = 10, type } = req.query;

    const wallet = await Wallet.findOne({ userId: customerId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found.',
      });
    }

    const query = { walletId: wallet._id };
    if (type) query.type = type;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions.',
      error: error.message,
    });
  }
};

exports.getRideHistory = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { passengerId: customerId };
    if (status) query.status = status;

    const rides = await Ride.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('driverId', 'name rating');

    const total = await Ride.countDocuments(query);

    res.json({
      success: true,
      data: rides,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ride history.',
      error: error.message,
    });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { period = 'month' } = req.query;

    let startDate = new Date();
    if (period === 'day') {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setDate(1);
    } else if (period === 'year') {
      startDate.setMonth(0, 1);
    }

    const wallet = await Wallet.findOne({ userId: customerId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found.',
      });
    }

    const rides = await Ride.find({
      passengerId: customerId,
      createdAt: { $gte: startDate },
    });

    const transactions = await Transaction.find({
      walletId: wallet._id,
      createdAt: { $gte: startDate },
    });

    const spendingByType = {};
    transactions.forEach((t) => {
      spendingByType[t.type] = (spendingByType[t.type] || 0) + t.amount;
    });

    res.json({
      success: true,
      data: {
        totalSpent: rides.reduce((sum, r) => sum + r.calculatedFare, 0),
        rideCount: rides.length,
        transactionCount: transactions.length,
        averageFarePerRide: rides.length > 0 ? rides.reduce((sum, r) => sum + r.calculatedFare, 0) / rides.length : 0,
        spendingByType,
        period,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics.',
      error: error.message,
    });
  }
};
