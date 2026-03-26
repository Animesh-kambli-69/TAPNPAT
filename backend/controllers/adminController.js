const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Ride = require('../models/Ride');
const Analytics = require('../models/Analytics');

exports.getDashboard = async (req, res) => {
  try {
    // Total users by role
    const totalUsers = await User.countDocuments();
    const driverCount = await User.countDocuments({ role: 'driver' });
    const customerCount = await User.countDocuments({ role: 'customer' });
    const merchantCount = await User.countDocuments({ role: 'merchant' });

    // Total transactions
    const totalTransactions = await Transaction.countDocuments();
    const completedTransactions = await Transaction.countDocuments({ status: 'completed' });

    // Total revenue
    const transactions = await Transaction.find({ status: 'completed' });
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

    // Average transaction
    const averageTransaction = totalTransactions > 0 ? totalRevenue / completedTransactions : 0;

    // Recent transactions
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email');

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          drivers: driverCount,
          customers: customerCount,
          merchants: merchantCount,
        },
        transactions: {
          total: totalTransactions,
          completed: completedTransactions,
        },
        revenue: {
          total: totalRevenue.toFixed(2),
          average: averageTransaction.toFixed(2),
        },
        recentTransactions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard.',
      error: error.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-password');

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users.',
      error: error.message,
    });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ['driver', 'customer', 'merchant', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role.',
      });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

    res.json({
      success: true,
      message: 'User role updated.',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user role.',
      error: error.message,
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10, startDate, endDate } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('userId', 'name email phone');

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

exports.getAnalytics = async (req, res) => {
  try {
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

    const rides = await Ride.find({
      createdAt: { $gte: startDate },
    });

    const transactions = await Transaction.find({
      createdAt: { $gte: startDate },
    });

    const completedTransactions = transactions.filter((t) => t.status === 'completed');
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
    const successRate = transactions.length > 0 ? (completedTransactions.length / transactions.length) * 100 : 0;

    res.json({
      success: true,
      data: {
        period,
        rides: rides.length,
        transactions: transactions.length,
        completedTransactions: completedTransactions.length,
        totalRevenue: totalRevenue.toFixed(2),
        successRate: successRate.toFixed(2),
        averageTransactionValue: completedTransactions.length > 0 ? (totalRevenue / completedTransactions.length).toFixed(2) : 0,
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
