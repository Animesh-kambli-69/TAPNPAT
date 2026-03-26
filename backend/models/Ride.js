const mongoose = require('mongoose');
const { RIDE_STATUS } = require('../config/constants');

const sharedRidePassengerSchema = new mongoose.Schema({
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fare: {
    type: Number,
    required: true,
    min: 0,
  },
  pickupLocation: String,
  dropoffLocation: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
});

const rideSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    passengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startLocation: {
      type: String,
      required: true,
    },
    endLocation: {
      type: String,
      required: true,
    },
    pickupLatitude: Number,
    pickupLongitude: Number,
    dropoffLatitude: Number,
    dropoffLongitude: Number,
    distance: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    calculatedFare: {
      type: Number,
      required: true,
      min: 0,
    },
    actualFare: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(RIDE_STATUS),
      default: RIDE_STATUS.UPCOMING,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: null,
    },
    sharedPassengers: [sharedRidePassengerSchema],
    rideType: {
      type: String,
      enum: ['individual', 'shared'],
      default: 'individual',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    passengerRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    driverRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    passengerFeedback: String,
    driverFeedback: String,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Calculate total fare for shared rides
rideSchema.methods.getTotalFare = function () {
  if (this.rideType === 'shared' && this.sharedPassengers.length > 0) {
    return this.sharedPassengers.reduce((sum, p) => sum + p.fare, 0);
  }
  return this.calculatedFare;
};

// Get duration in minutes
rideSchema.methods.getDurationMinutes = function () {
  const endTime = this.endTime || new Date();
  return Math.floor((endTime - this.startTime) / (1000 * 60));
};

// Index for queries
rideSchema.index({ driverId: 1, createdAt: -1 });
rideSchema.index({ passengerId: 1, createdAt: -1 });
rideSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Ride', rideSchema);
