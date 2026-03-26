const Ride = require('../models/Ride');
const Transaction = require('../models/Transaction');
const Analytics = require('../models/Analytics');
const User = require('../models/User');
const Wallet = require('../models/Wallet');

exports.getDashboard = async (req, res) => {
  try {
    const driverId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's rides
    const todayRides = await Ride.find({
      driverId,
      createdAt: { $gte: today },
    });

    // Today's earnings
    const todayEarnings = todayRides.reduce((sum, ride) => sum + ride.calculatedFare, 0);

    // Total rides
    const totalRides = await Ride.countDocuments({ driverId });

    // Average rating
    const driver = await User.findById(driverId);

    // Recent rides
    const recentRides = await Ride.find({ driverId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('passengerId', 'name rating');

    res.json({
      success: true,
      data: {
        todayEarnings,
        todayRides: todayRides.length,
        totalRides,
        rating: driver.rating,
        recentRides,
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

exports.getRides = async (req, res) => {
  try {
    const driverId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { driverId };
    if (status) query.status = status;

    const rides = await Ride.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('passengerId', 'name rating');

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
      message: 'Failed to fetch rides.',
      error: error.message,
    });
  }
};

exports.getEarnings = async (req, res) => {
  try {
    const driverId = req.user.id;
    const { period = 'month' } = req.query;

    let startDate = new Date();
    if (period === 'day') {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'year') {
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0);
    }

    const rides = await Ride.find({
      driverId,
      createdAt: { $gte: startDate },
    });

    const totalEarnings = rides.reduce((sum, ride) => sum + ride.calculatedFare, 0);
    const rideCount = rides.length;
    const averageFare = rideCount > 0 ? totalEarnings / rideCount : 0;

    // Daily breakdown
    const earnings = {};
    rides.forEach((ride) => {
      const date = ride.createdAt.toLocaleDateString();
      earnings[date] = (earnings[date] || 0) + ride.calculatedFare;
    });

    res.json({
      success: true,
      data: {
        totalEarnings,
        rideCount,
        averageFare: averageFare.toFixed(2),
        period,
        dailyBreakdown: earnings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch earnings.',
      error: error.message,
    });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const driverId = req.user.id;
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
      driverId,
      createdAt: { $gte: startDate },
    });

    const metrics = {
      totalRides: rides.length,
      completedRides: rides.filter((r) => r.status === 'completed').length,
      cancelledRides: rides.filter((r) => r.status === 'cancelled').length,
      totalEarnings: rides.reduce((sum, r) => sum + r.calculatedFare, 0),
      averageFare: rides.length > 0 ? rides.reduce((sum, r) => sum + r.calculatedFare, 0) / rides.length : 0,
      totalDistance: rides.reduce((sum, r) => sum + (r.distance || 0), 0),
      totalDuration: rides.reduce((sum, r) => sum + (r.duration || 0), 0),
      averageRating: await User.findById(driverId).then((u) => u.rating),
    };

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics.',
      error: error.message,
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const driverId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const wallet = await Wallet.findOne({ userId: driverId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found.',
      });
    }

    const transactions = await Transaction.find({ walletId: wallet._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments({ walletId: wallet._id });

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
