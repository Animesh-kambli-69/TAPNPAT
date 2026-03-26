import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:tapnpat/models/transaction.dart';
import 'package:tapnpat/models/user.dart';
import 'package:tapnpat/models/wallet.dart';
import 'package:tapnpat/services/storage_interface.dart';
import 'package:tapnpat/utils/constants.dart';
import 'package:uuid/uuid.dart';

/// Thin wrapper around [SharedPreferences] for persisting app data locally.
class StorageService implements StorageInterface {
  StorageService._();

  static final StorageService _instance = StorageService._();
  static StorageService get instance => _instance;

  late SharedPreferences _prefs;
  bool _initialized = false;
  final _uuid = const Uuid();

  @override
  Future<void> init() async {
    if (!_initialized) {
      _prefs = await SharedPreferences.getInstance();
      _initialized = true;
    }
  }

  // ---------------------------------------------------------------------------
  // User
  // ---------------------------------------------------------------------------

  @override
  Future<User?> getCurrentUser() async {
    await _ensureInit();
    final json = _prefs.getString(AppConstants.keyCurrentUser);
    if (json == null) return null;
    return User.fromJson(jsonDecode(json) as Map<String, dynamic>);
  }

  @override
  Future<void> saveCurrentUser(User user) async {
    await _ensureInit();
    await _prefs.setString(
      AppConstants.keyCurrentUser,
      jsonEncode(user.toJson()),
    );
  }

  /// Creates and persists a default demo user + wallet if none exists.
  @override
  Future<User> getOrCreateDemoUser() async {
    final existing = await getCurrentUser();
    if (existing != null) return existing;

    final userId = _uuid.v4();
    final user = User(
      id: userId,
      name: 'Demo Driver',
      phone: '+91 98765 43210',
      email: 'demo@tapnpat.in',
      nfcId: _uuid.v4(),
    );

    final wallet = Wallet(
      id: _uuid.v4(),
      userId: userId,
      balance: 5000.0,
      lastUpdated: DateTime.now(),
    );

    await saveCurrentUser(user);
    await saveWallet(wallet);
    return user;
  }

  // ---------------------------------------------------------------------------
  // Wallet
  // ---------------------------------------------------------------------------

  @override
  Future<Wallet?> getWallet(String userId) async {
    await _ensureInit();
    final json = _prefs.getString('${AppConstants.keyWallet}_$userId');
    if (json == null) return null;
    return Wallet.fromJson(jsonDecode(json) as Map<String, dynamic>);
  }

  @override
  Future<void> saveWallet(Wallet wallet) async {
    await _ensureInit();
    await _prefs.setString(
      '${AppConstants.keyWallet}_${wallet.userId}',
      jsonEncode(wallet.toJson()),
    );
  }

  // ---------------------------------------------------------------------------
  // Transactions
  // ---------------------------------------------------------------------------

  @override
  Future<List<Transaction>> getTransactions() async {
    await _ensureInit();
    final jsonList = _prefs.getStringList(AppConstants.keyTransactions) ?? [];
    final transactions = jsonList
        .map((j) =>
            Transaction.fromJson(jsonDecode(j) as Map<String, dynamic>))
        .toList();
    transactions.sort((a, b) => b.timestamp.compareTo(a.timestamp));
    return transactions;
  }

  @override
  Future<void> saveTransaction(Transaction transaction) async {
    await _ensureInit();
    final existing =
        _prefs.getStringList(AppConstants.keyTransactions) ?? [];
    existing.add(jsonEncode(transaction.toJson()));
    await _prefs.setStringList(AppConstants.keyTransactions, existing);
  }

  @override
  Future<void> clearAll() async {
    await _ensureInit();
    await _prefs.clear();
  }

  // ---------------------------------------------------------------------------

  Future<void> _ensureInit() async {
    if (!_initialized) await init();
  }
}
