class AppConstants {
  AppConstants._();

  static const String appName = 'TAPNPAT';
  static const String currencySymbol = '₹';
  static const String currencyCode = 'INR';

  // Storage keys
  static const String keyCurrentUser = 'current_user';
  static const String keyWallet = 'wallet';
  static const String keyTransactions = 'transactions';

  // NFC
  static const String nfcPayloadType = 'tapnpat/payment';
  static const int nfcScanTimeoutSeconds = 30;

  // UI
  static const double defaultPadding = 16.0;
  static const double cardBorderRadius = 16.0;

  // Limits
  static const double maxTransactionAmount = 50000.0;
  static const double minTransactionAmount = 1.0;
}
