import 'package:flutter_test/flutter_test.dart';
import 'package:tapnpat/models/transaction.dart';
import 'package:tapnpat/models/user.dart';
import 'package:tapnpat/models/wallet.dart';
import 'package:tapnpat/services/storage_interface.dart';
import 'package:tapnpat/services/transaction_service.dart';

/// A minimal fake [StorageInterface] for unit testing [TransactionService].
class _FakeStorage implements StorageInterface {
  final Map<String, Wallet> _wallets = {};
  final List<Transaction> _transactions = [];

  @override
  Future<void> init() async {}

  @override
  Future<User?> getCurrentUser() async => null;

  @override
  Future<void> saveCurrentUser(User user) async {}

  @override
  Future<User> getOrCreateDemoUser() async => throw UnimplementedError();

  @override
  Future<Wallet?> getWallet(String userId) async => _wallets[userId];

  @override
  Future<void> saveWallet(Wallet wallet) async {
    _wallets[wallet.userId] = wallet;
  }

  @override
  Future<List<Transaction>> getTransactions() async {
    final list = List<Transaction>.from(_transactions);
    list.sort((a, b) => b.timestamp.compareTo(a.timestamp));
    return list;
  }

  @override
  Future<void> saveTransaction(Transaction transaction) async {
    _transactions.add(transaction);
  }

  @override
  Future<void> clearAll() async {
    _wallets.clear();
    _transactions.clear();
  }

  void seedWallet(Wallet wallet) => _wallets[wallet.userId] = wallet;
}

void main() {
  late _FakeStorage storage;
  late TransactionService service;

  const userId = 'user-1';
  const userName = 'Alice';
  const recipientId = 'user-2';
  const recipientName = 'Bob';

  setUp(() {
    storage = _FakeStorage();
    service = TransactionService(storage: storage);

    storage.seedWallet(
      Wallet(
        id: 'wallet-1',
        userId: userId,
        balance: 2000.0,
        lastUpdated: DateTime(2024, 1, 1),
      ),
    );
    storage.seedWallet(
      Wallet(
        id: 'wallet-2',
        userId: recipientId,
        balance: 500.0,
        lastUpdated: DateTime(2024, 1, 1),
      ),
    );
  });

  group('TransactionService.sendPayment', () {
    test('deducts amount from sender wallet and saves transaction', () async {
      final tx = await service.sendPayment(
        fromUserId: userId,
        fromUserName: userName,
        toUserId: recipientId,
        toUserName: recipientName,
        amount: 300.0,
        description: 'Fuel',
      );

      expect(tx.amount, equals(300.0));
      expect(tx.type, equals(TransactionType.send));
      expect(tx.status, equals(TransactionStatus.completed));
      expect(tx.fromUserId, equals(userId));
      expect(tx.toUserId, equals(recipientId));

      final updatedWallet = await storage.getWallet(userId);
      expect(updatedWallet!.balance, equals(1700.0));
    });

    test('throws when balance is insufficient', () async {
      await expectLater(
        () => service.sendPayment(
          fromUserId: userId,
          fromUserName: userName,
          toUserId: recipientId,
          toUserName: recipientName,
          amount: 9999.0,
        ),
        throwsException,
      );
    });

    test('throws when amount is below minimum', () async {
      await expectLater(
        () => service.sendPayment(
          fromUserId: userId,
          fromUserName: userName,
          toUserId: recipientId,
          toUserName: recipientName,
          amount: 0.5,
        ),
        throwsException,
      );
    });

    test('throws when amount exceeds maximum', () async {
      // Give enough balance
      storage.seedWallet(
        Wallet(
          id: 'wallet-rich',
          userId: userId,
          balance: 100000.0,
          lastUpdated: DateTime.now(),
        ),
      );

      await expectLater(
        () => service.sendPayment(
          fromUserId: userId,
          fromUserName: userName,
          toUserId: recipientId,
          toUserName: recipientName,
          amount: 60000.0,
        ),
        throwsException,
      );
    });
  });

  group('TransactionService.receivePayment', () {
    test('credits amount to receiver wallet and saves transaction', () async {
      final tx = await service.receivePayment(
        receiverUserId: recipientId,
        receiverUserName: recipientName,
        senderUserId: userId,
        senderUserName: userName,
        amount: 150.0,
        description: 'Toll fee',
      );

      expect(tx.amount, equals(150.0));
      expect(tx.type, equals(TransactionType.receive));
      expect(tx.status, equals(TransactionStatus.completed));
      expect(tx.toUserId, equals(recipientId));

      final updatedWallet = await storage.getWallet(recipientId);
      expect(updatedWallet!.balance, equals(650.0));
    });

    test('throws when receiver wallet not found', () async {
      await expectLater(
        () => service.receivePayment(
          receiverUserId: 'unknown-user',
          receiverUserName: 'Ghost',
          senderUserId: userId,
          senderUserName: userName,
          amount: 100.0,
        ),
        throwsException,
      );
    });
  });

  group('TransactionService.getTransactions', () {
    test('returns all saved transactions sorted newest first', () async {
      await service.sendPayment(
        fromUserId: userId,
        fromUserName: userName,
        toUserId: recipientId,
        toUserName: recipientName,
        amount: 100.0,
      );
      await service.sendPayment(
        fromUserId: userId,
        fromUserName: userName,
        toUserId: recipientId,
        toUserName: recipientName,
        amount: 200.0,
      );

      final txs = await service.getTransactions();
      expect(txs.length, equals(2));
      // Newest first
      expect(
        txs[0].timestamp.isAfter(txs[1].timestamp) ||
            txs[0].timestamp.isAtSameMomentAs(txs[1].timestamp),
        isTrue,
      );
    });
  });
}
