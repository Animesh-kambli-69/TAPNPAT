const mongoose = require('mongoose');
const { TRANSACTION_TYPES, TRANSACTION_STATUS } = require('../config/constants');

const transactionSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPES),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS),
      default: TRANSACTION_STATUS.PENDING,
    },
    description: {
      type: String,
      default: null,
    },
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      default: null,
    },
    nfcDeviceId: {
      type: String,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ['nfc', 'upi', 'card', 'wallet'],
      default: 'nfc',
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    failureReason: {
      type: String,
      default: null,
    },
    metadata: {
      type: Map,
      of: String,
      default: new Map(),
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ walletId: 1, status: 1 });
transactionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
