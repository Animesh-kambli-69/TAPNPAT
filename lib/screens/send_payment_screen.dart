import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:tapnpat/models/transaction.dart';
import 'package:tapnpat/providers/wallet_provider.dart';
import 'package:tapnpat/services/nfc_service.dart';
import 'package:tapnpat/utils/constants.dart';
import 'package:tapnpat/utils/theme.dart';
import 'package:tapnpat/widgets/nfc_scan_overlay.dart';
import 'package:uuid/uuid.dart';

class SendPaymentScreen extends StatefulWidget {
  const SendPaymentScreen({super.key});

  @override
  State<SendPaymentScreen> createState() => _SendPaymentScreenState();
}

class _SendPaymentScreenState extends State<SendPaymentScreen> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _recipientController = TextEditingController();

  bool _isScanning = false;
  bool _isProcessing = false;
  String? _errorMessage;

  @override
  void dispose() {
    _amountController.dispose();
    _descriptionController.dispose();
    _recipientController.dispose();
    super.dispose();
  }

  Future<void> _startNfcSend() async {
    if (!_formKey.currentState!.validate()) return;

    final nfcAvailable = await NfcService.instance.isNfcAvailable();
    if (!nfcAvailable) {
      _showError('NFC is not available on this device or is disabled.');
      return;
    }

    setState(() {
      _isScanning = true;
      _errorMessage = null;
    });

    final provider = context.read<WalletProvider>();
    final user = provider.currentUser;
    if (user == null) {
      setState(() => _isScanning = false);
      _showError('User not initialized.');
      return;
    }

    final amount = double.tryParse(_amountController.text) ?? 0;
    final payload = NfcPayload(
      senderId: user.id,
      senderName: user.name,
      amount: amount,
      transactionId: const Uuid().v4(),
      description: _descriptionController.text.trim(),
    );

    await NfcService.instance.startWriting(
      payload: payload,
      onSuccess: () async {
        if (!mounted) return;
        setState(() {
          _isScanning = false;
          _isProcessing = true;
        });

        try {
          final recipient = _recipientController.text.trim();
          await provider.sendPayment(
            toUserId: 'nfc_recipient',
            toUserName: recipient.isNotEmpty ? recipient : 'NFC Recipient',
            amount: amount,
            description: _descriptionController.text.trim(),
            nfcTagId: payload.transactionId,
          );
          if (mounted) {
            _showSuccess();
          }
        } catch (e) {
          if (mounted) {
            setState(() {
              _isProcessing = false;
              _errorMessage = e.toString().replaceFirst('Exception: ', '');
            });
          }
        }
      },
      onError: (error) {
        if (mounted) {
          setState(() => _isScanning = false);
          _showError(error);
        }
      },
    );
  }

  void _cancelScan() {
    NfcService.instance.stopSession(errorMessage: 'Cancelled by user.');
    setState(() => _isScanning = false);
  }

  void _showError(String msg) {
    setState(() => _errorMessage = msg);
  }

  void _showSuccess() {
    setState(() => _isProcessing = false);
    showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            Container(
              width: 72,
              height: 72,
              decoration: const BoxDecoration(
                color: AppTheme.successColor,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.check_rounded,
                color: Colors.white,
                size: 44,
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Payment Sent!',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 8),
            Text(
              '${AppConstants.currencySymbol}'
              '${double.parse(_amountController.text).toStringAsFixed(2)} '
              'has been sent successfully.',
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppTheme.textSecondaryColor),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close dialog
                Navigator.of(context).pop(); // Go back to home
              },
              child: const Text('Done'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Scaffold(
          appBar: AppBar(title: const Text('Send Payment')),
          body: Consumer<WalletProvider>(
            builder: (context, provider, _) {
              final wallet = provider.wallet;
              return SingleChildScrollView(
                padding: const EdgeInsets.all(AppConstants.defaultPadding),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Balance indicator
                      if (wallet != null)
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color:
                                AppTheme.primaryColor.withOpacity(0.08),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Row(
                            children: [
                              const Icon(
                                Icons.account_balance_wallet_rounded,
                                color: AppTheme.primaryColor,
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Available Balance',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: AppTheme.textSecondaryColor,
                                    ),
                                  ),
                                  Text(
                                    wallet.formattedBalance,
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w700,
                                      color: AppTheme.primaryColor,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      const SizedBox(height: 24),

                      // Recipient
                      const _FieldLabel(label: 'Recipient Name'),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _recipientController,
                        decoration: const InputDecoration(
                          hintText: 'Enter recipient name',
                          prefixIcon:
                              Icon(Icons.person_outline_rounded),
                        ),
                        validator: (v) =>
                            (v == null || v.trim().isEmpty)
                                ? 'Please enter recipient name'
                                : null,
                      ),
                      const SizedBox(height: 16),

                      // Amount
                      const _FieldLabel(label: 'Amount (₹)'),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _amountController,
                        keyboardType: const TextInputType.numberWithOptions(
                          decimal: true,
                        ),
                        inputFormatters: [
                          FilteringTextInputFormatter.allow(
                            RegExp(r'^\d+\.?\d{0,2}'),
                          ),
                        ],
                        decoration: const InputDecoration(
                          hintText: '0.00',
                          prefixIcon: Icon(Icons.currency_rupee_rounded),
                        ),
                        validator: _validateAmount,
                      ),
                      const SizedBox(height: 16),

                      // Description
                      const _FieldLabel(
                          label: 'Description (optional)'),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _descriptionController,
                        decoration: const InputDecoration(
                          hintText: 'e.g. Fuel payment, Toll fee',
                          prefixIcon: Icon(Icons.note_outlined),
                        ),
                        maxLength: 100,
                      ),
                      const SizedBox(height: 8),

                      // Error message
                      if (_errorMessage != null)
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppTheme.errorColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            children: [
                              const Icon(
                                Icons.error_outline,
                                color: AppTheme.errorColor,
                                size: 18,
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  _errorMessage!,
                                  style: const TextStyle(
                                    color: AppTheme.errorColor,
                                    fontSize: 13,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      const SizedBox(height: 24),

                      // Send button
                      ElevatedButton.icon(
                        onPressed: _isProcessing ? null : _startNfcSend,
                        icon: _isProcessing
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                            : const Icon(Icons.nfc_rounded),
                        label: Text(
                          _isProcessing
                              ? 'Processing...'
                              : 'Tap to Send via NFC',
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),

        // NFC scanning overlay
        if (_isScanning)
          Positioned.fill(
            child: NfcScanOverlay(
              message: 'Hold near recipient\'s device',
              onCancel: _cancelScan,
            ),
          ),
      ],
    );
  }

  String? _validateAmount(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter an amount';
    }
    final amount = double.tryParse(value);
    if (amount == null) return 'Invalid amount';
    if (amount < AppConstants.minTransactionAmount) {
      return 'Minimum amount is '
          '${AppConstants.currencySymbol}'
          '${AppConstants.minTransactionAmount.toStringAsFixed(2)}';
    }
    if (amount > AppConstants.maxTransactionAmount) {
      return 'Maximum amount is '
          '${AppConstants.currencySymbol}'
          '${AppConstants.maxTransactionAmount.toStringAsFixed(2)}';
    }
    final wallet = context.read<WalletProvider>().wallet;
    if (wallet != null && amount > wallet.balance) {
      return 'Insufficient balance';
    }
    return null;
  }
}

class _FieldLabel extends StatelessWidget {
  const _FieldLabel({required this.label});
  final String label;

  @override
  Widget build(BuildContext context) {
    return Text(
      label,
      style: const TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: AppTheme.textPrimaryColor,
      ),
    );
  }
}
