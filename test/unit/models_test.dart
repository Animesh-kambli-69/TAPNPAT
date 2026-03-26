import 'package:flutter_test/flutter_test.dart';
import 'package:tapnpat/models/transaction.dart';
import 'package:tapnpat/models/user.dart';
import 'package:tapnpat/models/wallet.dart';

void main() {
  group('Transaction model', () {
    final now = DateTime(2024, 6, 15, 10, 30);
    final tx = Transaction(
      id: 'tx-001',
      fromUserId: 'u1',
      toUserId: 'u2',
      fromUserName: 'Alice',
      toUserName: 'Bob',
      amount: 250.50,
      type: TransactionType.send,
      status: TransactionStatus.completed,
      timestamp: now,
      description: 'Fuel payment',
      nfcTagId: 'AA:BB:CC',
    );

    test('formattedAmount returns correct string', () {
      expect(tx.formattedAmount, equals('₹250.50'));
    });

    test('isCredit returns false for send', () {
      expect(tx.isCredit, isFalse);
    });

    test('isCredit returns true for receive', () {
      final received = tx.copyWith(type: TransactionType.receive);
      expect(received.isCredit, isTrue);
    });

    test('toJson / fromJson round-trip', () {
      final json = tx.toJson();
      final restored = Transaction.fromJson(json);
      expect(restored.id, equals(tx.id));
      expect(restored.amount, equals(tx.amount));
      expect(restored.type, equals(tx.type));
      expect(restored.status, equals(tx.status));
      expect(restored.description, equals(tx.description));
      expect(restored.nfcTagId, equals(tx.nfcTagId));
    });

    test('copyWith creates updated copy', () {
      final updated = tx.copyWith(amount: 500, status: TransactionStatus.pending);
      expect(updated.amount, equals(500));
      expect(updated.status, equals(TransactionStatus.pending));
      expect(updated.id, equals(tx.id)); // unchanged
    });
  });

  group('User model', () {
    const user = User(
      id: 'u-001',
      name: 'Animesh Kambli',
      phone: '+91 98765 43210',
      nfcId: 'nfc-abc-123',
    );

    test('initials returns first letters of first and last name', () {
      expect(user.initials, equals('AK'));
    });

    test('initials for single word name returns first letter', () {
      const singleName = User(
        id: 'u-002',
        name: 'Animesh',
        phone: '123',
        nfcId: 'nfc-x',
      );
      expect(singleName.initials, equals('A'));
    });

    test('toJson / fromJson round-trip', () {
      final json = user.toJson();
      final restored = User.fromJson(json);
      expect(restored.id, equals(user.id));
      expect(restored.name, equals(user.name));
      expect(restored.nfcId, equals(user.nfcId));
    });

    test('copyWith updates fields correctly', () {
      final updated = user.copyWith(name: 'New Name');
      expect(updated.name, equals('New Name'));
      expect(updated.id, equals(user.id));
    });
  });

  group('Wallet model', () {
    final wallet = Wallet(
      id: 'w-001',
      userId: 'u-001',
      balance: 3500.00,
      lastUpdated: DateTime(2024, 1, 1),
    );

    test('formattedBalance returns correct string', () {
      expect(wallet.formattedBalance, equals('₹3500.00'));
    });

    test('hasSufficientFunds is true when balance > 0', () {
      expect(wallet.hasSufficientFunds, isTrue);
    });

    test('hasSufficientFunds is false when balance is 0', () {
      final empty = wallet.copyWith(balance: 0);
      expect(empty.hasSufficientFunds, isFalse);
    });

    test('toJson / fromJson round-trip', () {
      final json = wallet.toJson();
      final restored = Wallet.fromJson(json);
      expect(restored.id, equals(wallet.id));
      expect(restored.balance, equals(wallet.balance));
      expect(restored.currency, equals('INR'));
    });
  });
}
