const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: '₹',
    },
    minBalance: {
      type: Number,
      default: 0,
    },
    maxBalance: {
      type: Number,
      default: 100000,
    },
    totalCredit: {
      type: Number,
      default: 0,
    },
    totalDebit: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        transactionId: mongoose.Schema.Types.ObjectId,
        amount: Number,
        type: String,
        timestamp: Date,
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Method to add transaction to history
walletSchema.methods.addTransaction = function (transactionData) {
  this.transactions.push({
    transactionId: transactionData.id,
    amount: transactionData.amount,
    type: transactionData.type,
    timestamp: new Date(),
  });

  if (transactionData.type === 'topup') {
    this.totalCredit += transactionData.amount;
  } else {
    this.totalDebit += transactionData.amount;
  }
};

// Method to check if wallet can transact
walletSchema.methods.canTransact = function (amount) {
  return (
    this.balance >= this.minBalance &&
    this.balance <= this.maxBalance &&
    this.balance >= amount &&
    !this.isBlocked
  );
};

module.exports = mongoose.model('Wallet', walletSchema);
