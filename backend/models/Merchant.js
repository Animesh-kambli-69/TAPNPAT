const mongoose = require('mongoose');
const { MERCHANT_CATEGORIES } = require('../config/constants');

const merchantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: Object.values(MERCHANT_CATEGORIES),
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    latitude: Number,
    longitude: Number,
    city: String,
    state: String,
    postalCode: String,
    phone: String,
    email: String,
    logo: String,
    businessRegistration: String,
    totalCustomers: {
      type: Number,
      default: 0,
    },
    totalTransactionVolume: {
      type: Number,
      default: 0,
    },
    totalTransactions: {
      type: Number,
      default: 0,
    },
    averageTransactionValue: {
      type: Number,
      default: 0,
    },
    successRate: {
      type: Number,
      default: 100,
    },
    discount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

// Index for queries
merchantSchema.index({ userId: 1 });
merchantSchema.index({ category: 1 });
merchantSchema.index({ location: 1 });

module.exports = mongoose.model('Merchant', merchantSchema);
