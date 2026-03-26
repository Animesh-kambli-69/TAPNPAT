module.exports = {
  // User Roles
  USER_ROLES: {
    DRIVER: 'driver',
    CUSTOMER: 'customer',
    MERCHANT: 'merchant',
    ADMIN: 'admin',
  },

  // Transaction Types
  TRANSACTION_TYPES: {
    PAYMENT: 'payment',
    TOPUP: 'topup',
    REFUND: 'refund',
  },

  // Transaction Status
  TRANSACTION_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
  },

  // Ride Status
  RIDE_STATUS: {
    UPCOMING: 'upcoming',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },

  // Merchant Categories
  MERCHANT_CATEGORIES: {
    DMART: 'dmart',
    MALL: 'mall',
    FOOD_COURT: 'food_court',
    OTHER: 'other',
  },

  // JWT Expiry
  JWT_EXPIRY: '7d',
  REFRESH_TOKEN_EXPIRY: '30d',

  // Fare Constants
  BASE_FARE: 25,
  PER_KM_RATE: 8,
  PER_MINUTE_RATE: 1,
  NIGHT_CHARGE_MULTIPLIER: 1.2,
  NIGHT_CHARGE_START: 22, // 10 PM
  NIGHT_CHARGE_END: 6, // 6 AM

  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // API Ports
  PORT: process.env.PORT || 5000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};
