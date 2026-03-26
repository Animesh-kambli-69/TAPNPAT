import 'package:tapnpat/utils/constants.dart';

enum TransactionType { send, receive }

enum TransactionStatus { pending, completed, failed }

class Transaction {
  final String id;
  final String fromUserId;
  final String toUserId;
  final String fromUserName;
  final String toUserName;
  final double amount;
  final TransactionType type;
  final TransactionStatus status;
  final DateTime timestamp;
  final String? description;
  final String? nfcTagId;

  const Transaction({
    required this.id,
    required this.fromUserId,
    required this.toUserId,
    required this.fromUserName,
    required this.toUserName,
    required this.amount,
    required this.type,
    required this.status,
    required this.timestamp,
    this.description,
    this.nfcTagId,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'] as String,
      fromUserId: json['fromUserId'] as String,
      toUserId: json['toUserId'] as String,
      fromUserName: json['fromUserName'] as String,
      toUserName: json['toUserName'] as String,
      amount: (json['amount'] as num).toDouble(),
      type: TransactionType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => TransactionType.send,
      ),
      status: TransactionStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => TransactionStatus.pending,
      ),
      timestamp: DateTime.parse(json['timestamp'] as String),
      description: json['description'] as String?,
      nfcTagId: json['nfcTagId'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fromUserId': fromUserId,
      'toUserId': toUserId,
      'fromUserName': fromUserName,
      'toUserName': toUserName,
      'amount': amount,
      'type': type.name,
      'status': status.name,
      'timestamp': timestamp.toIso8601String(),
      'description': description,
      'nfcTagId': nfcTagId,
    };
  }

  Transaction copyWith({
    String? id,
    String? fromUserId,
    String? toUserId,
    String? fromUserName,
    String? toUserName,
    double? amount,
    TransactionType? type,
    TransactionStatus? status,
    DateTime? timestamp,
    String? description,
    String? nfcTagId,
  }) {
    return Transaction(
      id: id ?? this.id,
      fromUserId: fromUserId ?? this.fromUserId,
      toUserId: toUserId ?? this.toUserId,
      fromUserName: fromUserName ?? this.fromUserName,
      toUserName: toUserName ?? this.toUserName,
      amount: amount ?? this.amount,
      type: type ?? this.type,
      status: status ?? this.status,
      timestamp: timestamp ?? this.timestamp,
      description: description ?? this.description,
      nfcTagId: nfcTagId ?? this.nfcTagId,
    );
  }

  String get formattedAmount {
    return '${AppConstants.currencySymbol}${amount.toStringAsFixed(2)}';
  }

  bool get isCredit => type == TransactionType.receive;
}
