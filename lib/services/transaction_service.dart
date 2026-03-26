import 'package:tapnpat/models/transaction.dart';
import 'package:tapnpat/models/wallet.dart';
import 'package:tapnpat/services/storage_interface.dart';
import 'package:tapnpat/services/storage_service.dart';
import 'package:tapnpat/utils/constants.dart';
import 'package:uuid/uuid.dart';

class TransactionService {
  TransactionService({StorageInterface? storage})
      : _storage = storage ?? StorageService.instance;

  final StorageInterface _storage;
  final _uuid = const Uuid();

  /// Returns all stored transactions, newest first.
  Future<List<Transaction>> getTransactions() async {
    return _storage.getTransactions();
  }

  /// Creates and persists a new send transaction.
  ///
  /// Returns the resulting [Transaction] on success, or throws if funds are
  /// insufficient.
  Future<Transaction> sendPayment({
    required String fromUserId,
    required String fromUserName,
    required String toUserId,
    required String toUserName,
    required double amount,
    String? description,
    String? nfcTagId,
  }) async {
    if (amount < AppConstants.minTransactionAmount) {
      throw Exception(
        'Amount must be at least ${AppConstants.currencySymbol}'
        '${AppConstants.minTransactionAmount.toStringAsFixed(2)}.',
      );
    }
    if (amount > AppConstants.maxTransactionAmount) {
      throw Exception(
        'Amount exceeds the maximum limit of '
        '${AppConstants.currencySymbol}'
        '${AppConstants.maxTransactionAmount.toStringAsFixed(2)}.',
      );
    }

    final wallet = await _storage.getWallet(fromUserId);
    if (wallet == null || wallet.balance < amount) {
      throw Exception('Insufficient wallet balance.');
    }

    final transaction = Transaction(
      id: _uuid.v4(),
      fromUserId: fromUserId,
      toUserId: toUserId,
      fromUserName: fromUserName,
      toUserName: toUserName,
      amount: amount,
      type: TransactionType.send,
      status: TransactionStatus.completed,
      timestamp: DateTime.now(),
      description: description,
      nfcTagId: nfcTagId,
    );

    // Deduct from sender's wallet.
    final updatedWallet = wallet.copyWith(
      balance: wallet.balance - amount,
      lastUpdated: DateTime.now(),
    );
    await _storage.saveWallet(updatedWallet);
    await _storage.saveTransaction(transaction);

    return transaction;
  }

  /// Records an incoming payment (credit) for [receiverUserId].
  Future<Transaction> receivePayment({
    required String receiverUserId,
    required String receiverUserName,
    required String senderUserId,
    required String senderUserName,
    required double amount,
    String? description,
    String? nfcTagId,
  }) async {
    final wallet = await _storage.getWallet(receiverUserId);
    if (wallet == null) {
      throw Exception('Wallet not found for receiver.');
    }

    final transaction = Transaction(
      id: _uuid.v4(),
      fromUserId: senderUserId,
      toUserId: receiverUserId,
      fromUserName: senderUserName,
      toUserName: receiverUserName,
      amount: amount,
      type: TransactionType.receive,
      status: TransactionStatus.completed,
      timestamp: DateTime.now(),
      description: description,
      nfcTagId: nfcTagId,
    );

    // Credit receiver's wallet.
    final updatedWallet = wallet.copyWith(
      balance: wallet.balance + amount,
      lastUpdated: DateTime.now(),
    );
    await _storage.saveWallet(updatedWallet);
    await _storage.saveTransaction(transaction);

    return transaction;
  }

  /// Returns transactions filtered by [type], newest first.
  Future<List<Transaction>> getTransactionsByType(
    TransactionType type,
  ) async {
    final all = await getTransactions();
    return all.where((t) => t.type == type).toList();
  }

  /// Returns the wallet balance for [userId].
  Future<Wallet?> getWallet(String userId) {
    return _storage.getWallet(userId);
  }
}
