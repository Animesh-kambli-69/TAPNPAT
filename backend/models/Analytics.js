const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    rideCount: {
      type: Number,
      default: 0,
    },
    transactionCount: {
      type: Number,
      default: 0,
    },
    averageFare: {
      type: Number,
      default: 0,
    },
    successRate: {
      type: Number,
      default: 100,
    },
    totalDistance: {
      type: Number,
      default: 0,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    cancelledRides: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast queries
analyticsSchema.index({ userId: 1, date: -1 });
analyticsSchema.index({ date: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
