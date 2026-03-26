import 'dart:convert';

import 'package:nfc_manager/nfc_manager.dart';
import 'package:tapnpat/models/transaction.dart';
import 'package:tapnpat/utils/constants.dart';

/// Payload structure written to / read from an NFC tag during a payment.
class NfcPayload {
  final String senderId;
  final String senderName;
  final double amount;
  final String transactionId;
  final String description;

  const NfcPayload({
    required this.senderId,
    required this.senderName,
    required this.amount,
    required this.transactionId,
    required this.description,
  });

  factory NfcPayload.fromJson(Map<String, dynamic> json) {
    return NfcPayload(
      senderId: json['senderId'] as String,
      senderName: json['senderName'] as String,
      amount: (json['amount'] as num).toDouble(),
      transactionId: json['transactionId'] as String,
      description: json['description'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'senderId': senderId,
      'senderName': senderName,
      'amount': amount,
      'transactionId': transactionId,
      'description': description,
    };
  }

  String toJsonString() => jsonEncode(toJson());

  static NfcPayload? fromJsonString(String jsonString) {
    try {
      return NfcPayload.fromJson(
        jsonDecode(jsonString) as Map<String, dynamic>,
      );
    } catch (_) {
      return null;
    }
  }
}

/// Service that wraps [NfcManager] with simplified read / write helpers.
class NfcService {
  NfcService._();

  static final NfcService _instance = NfcService._();
  static NfcService get instance => _instance;

  // Allows injection of a mock in tests.
  NfcManager get _manager => NfcManager.instance;

  /// Returns `true` when the device hardware supports NFC.
  Future<bool> isNfcAvailable() async {
    return _manager.isAvailable();
  }

  /// Reads an NDEF record from an NFC tag.
  ///
  /// Calls [onDiscovered] with the decoded [NfcPayload] when a tag is tapped.
  /// Calls [onError] if the tag does not contain a valid TAPNPAT payload.
  Future<void> startReading({
    required void Function(NfcPayload payload, String tagId) onDiscovered,
    required void Function(String error) onError,
  }) async {
    try {
      await _manager.startSession(
        onDiscovered: (NfcTag tag) async {
          try {
            final ndef = Ndef.from(tag);
            if (ndef == null) {
              onError('Tag is not NDEF compatible.');
              return;
            }

            final cachedMessage = ndef.cachedMessage;
            if (cachedMessage == null || cachedMessage.records.isEmpty) {
              onError('No NDEF records found on tag.');
              return;
            }

            for (final record in cachedMessage.records) {
              final payload = _decodeRecord(record);
              if (payload != null) {
                final tagId = _tagId(tag);
                onDiscovered(payload, tagId);
                await _manager.stopSession();
                return;
              }
            }
            onError('Tag does not contain a valid TAPNPAT payment payload.');
          } catch (e) {
            onError('Failed to read NFC tag: $e');
          }
        },
      );
    } catch (e) {
      onError('Failed to start NFC session: $e');
    }
  }

  /// Writes a payment [payload] to an NFC tag.
  Future<void> startWriting({
    required NfcPayload payload,
    required void Function() onSuccess,
    required void Function(String error) onError,
  }) async {
    try {
      await _manager.startSession(
        onDiscovered: (NfcTag tag) async {
          try {
            final ndef = Ndef.from(tag);
            if (ndef == null) {
              onError('Tag is not NDEF compatible.');
              return;
            }
            if (!ndef.isWritable) {
              onError('Tag is read-only.');
              return;
            }

            final message = NdefMessage([
              NdefRecord.createText(
                '${AppConstants.nfcPayloadType}:${payload.toJsonString()}',
              ),
            ]);

            await ndef.write(message);
            onSuccess();
            await _manager.stopSession();
          } catch (e) {
            onError('Failed to write NFC tag: $e');
          }
        },
      );
    } catch (e) {
      onError('Failed to start NFC write session: $e');
    }
  }

  /// Stops any active NFC session.
  Future<void> stopSession({String? errorMessage}) async {
    await _manager.stopSession(errorMessage: errorMessage);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  NfcPayload? _decodeRecord(NdefRecord record) {
    try {
      // TNF 0x01 = Well Known, type 'T' = Text record
      if (record.typeNameFormat == NdefTypeNameFormat.nfcWellknown &&
          String.fromCharCodes(record.type) == 'T') {
        // Text records: first byte is status byte (language code length)
        final data = record.payload;
        final languageCodeLength = data[0] & 0x3F;
        final text = String.fromCharCodes(
          data.sublist(1 + languageCodeLength),
        );
        if (text.startsWith('${AppConstants.nfcPayloadType}:')) {
          final jsonPart =
              text.substring(AppConstants.nfcPayloadType.length + 1);
          return NfcPayload.fromJsonString(jsonPart);
        }
      }
    } catch (_) {
      // Not a parseable record – return null.
    }
    return null;
  }

  String _tagId(NfcTag tag) {
    // Try to extract the hardware identifier from common NFC tech data keys.
    const techKeys = ['nfca', 'nfcb', 'nfcf', 'nfcv'];
    for (final key in techKeys) {
      try {
        final techData = tag.data[key];
        if (techData is Map) {
          final identifier = techData['identifier'];
          if (identifier is List) {
            return identifier
                .map((b) => (b as int).toRadixString(16).padLeft(2, '0'))
                .join(':')
                .toUpperCase();
          }
        }
      } catch (_) {
        continue;
      }
    }
    return 'UNKNOWN';
  }
}
