import 'package:tapnpat/models/transaction.dart';
import 'package:tapnpat/models/user.dart';
import 'package:tapnpat/models/wallet.dart';

/// Abstract interface for storage operations.
/// Implement this in tests to avoid platform dependencies.
abstract class StorageInterface {
  Future<void> init();
  Future<User?> getCurrentUser();
  Future<void> saveCurrentUser(User user);
  Future<User> getOrCreateDemoUser();
  Future<Wallet?> getWallet(String userId);
  Future<void> saveWallet(Wallet wallet);
  Future<List<Transaction>> getTransactions();
  Future<void> saveTransaction(Transaction transaction);
  Future<void> clearAll();
}
