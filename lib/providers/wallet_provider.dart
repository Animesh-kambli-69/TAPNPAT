import 'package:flutter/foundation.dart';
import 'package:tapnpat/models/transaction.dart';
import 'package:tapnpat/models/user.dart';
import 'package:tapnpat/models/wallet.dart';
import 'package:tapnpat/services/storage_interface.dart';
import 'package:tapnpat/services/storage_service.dart';
import 'package:tapnpat/services/transaction_service.dart';

enum WalletState { initial, loading, loaded, error }

class WalletProvider extends ChangeNotifier {
  WalletProvider({
    StorageInterface? storage,
    TransactionService? transactionService,
  })  : _storage = storage ?? StorageService.instance,
        _transactionService =
            transactionService ?? TransactionService();

  final StorageInterface _storage;
  final TransactionService _transactionService;

  User? _currentUser;
  Wallet? _wallet;
  List<Transaction> _transactions = [];
  WalletState _state = WalletState.initial;
  String? _errorMessage;

  User? get currentUser => _currentUser;
  Wallet? get wallet => _wallet;
  List<Transaction> get transactions => List.unmodifiable(_transactions);
  WalletState get state => _state;
  String? get errorMessage => _errorMessage;
  bool get isLoading => _state == WalletState.loading;

  /// Initialize the provider by loading (or creating) the demo user + wallet.
  Future<void> initialize() async {
    _state = WalletState.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      await _storage.init();
      _currentUser = await _storage.getOrCreateDemoUser();
      _wallet = await _storage.getWallet(_currentUser!.id);
      _transactions = await _transactionService.getTransactions();
      _state = WalletState.loaded;
    } catch (e) {
      _state = WalletState.error;
      _errorMessage = 'Failed to load wallet: $e';
    }

    notifyListeners();
  }

  /// Refreshes wallet and transaction data.
  Future<void> refresh() async {
    if (_currentUser == null) {
      await initialize();
      return;
    }
    try {
      _wallet = await _storage.getWallet(_currentUser!.id);
      _transactions = await _transactionService.getTransactions();
    } catch (e) {
      _errorMessage = 'Failed to refresh: $e';
    }
    notifyListeners();
  }

  /// Sends a payment and updates local state.
  Future<Transaction> sendPayment({
    required String toUserId,
    required String toUserName,
    required double amount,
    String? description,
    String? nfcTagId,
  }) async {
    final user = _currentUser;
    if (user == null) throw Exception('User not initialized.');

    final tx = await _transactionService.sendPayment(
      fromUserId: user.id,
      fromUserName: user.name,
      toUserId: toUserId,
      toUserName: toUserName,
      amount: amount,
      description: description,
      nfcTagId: nfcTagId,
    );

    await refresh();
    return tx;
  }

  /// Records an incoming payment and updates local state.
  Future<Transaction> receivePayment({
    required String senderUserId,
    required String senderUserName,
    required double amount,
    String? description,
    String? nfcTagId,
  }) async {
    final user = _currentUser;
    if (user == null) throw Exception('User not initialized.');

    final tx = await _transactionService.receivePayment(
      receiverUserId: user.id,
      receiverUserName: user.name,
      senderUserId: senderUserId,
      senderUserName: senderUserName,
      amount: amount,
      description: description,
      nfcTagId: nfcTagId,
    );

    await refresh();
    return tx;
  }
}
