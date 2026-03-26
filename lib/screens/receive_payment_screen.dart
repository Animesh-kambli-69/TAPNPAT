import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:tapnpat/providers/wallet_provider.dart';
import 'package:tapnpat/services/nfc_service.dart';
import 'package:tapnpat/utils/constants.dart';
import 'package:tapnpat/utils/theme.dart';
import 'package:tapnpat/widgets/nfc_scan_overlay.dart';

class ReceivePaymentScreen extends StatefulWidget {
  const ReceivePaymentScreen({super.key});

  @override
  State<ReceivePaymentScreen> createState() => _ReceivePaymentScreenState();
}

class _ReceivePaymentScreenState extends State<ReceivePaymentScreen> {
  bool _isScanning = false;
  bool _isProcessing = false;
  String? _errorMessage;
  String? _successMessage;

  @override
  void initState() {
    super.initState();
  }

  Future<void> _startNfcReceive() async {
    final nfcAvailable = await NfcService.instance.isNfcAvailable();
    if (!nfcAvailable) {
      setState(() => _errorMessage =
          'NFC is not available on this device or is disabled.');
      return;
    }

    setState(() {
      _isScanning = true;
      _errorMessage = null;
      _successMessage = null;
    });

    await NfcService.instance.startReading(
      onDiscovered: (payload, tagId) async {
        if (!mounted) return;
        setState(() {
          _isScanning = false;
          _isProcessing = true;
        });

        try {
          final provider = context.read<WalletProvider>();
          await provider.receivePayment(
            senderUserId: payload.senderId,
            senderUserName: payload.senderName,
            amount: payload.amount,
            description: payload.description,
            nfcTagId: tagId,
          );
          if (mounted) {
            setState(() {
              _isProcessing = false;
              _successMessage =
                  '${AppConstants.currencySymbol}'
                  '${payload.amount.toStringAsFixed(2)} received from '
                  '${payload.senderName}';
            });
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
          setState(() {
            _isScanning = false;
            _errorMessage = error;
          });
        }
      },
    );
  }

  void _cancelScan() {
    NfcService.instance.stopSession(errorMessage: 'Cancelled by user.');
    setState(() => _isScanning = false);
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Scaffold(
          appBar: AppBar(title: const Text('Receive Payment')),
          body: Consumer<WalletProvider>(
            builder: (context, provider, _) {
              final user = provider.currentUser;
              final wallet = provider.wallet;

              return SingleChildScrollView(
                padding: const EdgeInsets.all(AppConstants.defaultPadding),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // QR code card
                    if (user != null)
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            children: [
                              const Text(
                                'Your NFC / QR Code',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Show this to the sender',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[500],
                                ),
                              ),
                              const SizedBox(height: 20),
                              QrImageView(
                                data: user.nfcId,
                                version: QrVersions.auto,
                                size: 180,
                                backgroundColor: Colors.white,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                user.name,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 18,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                user.phone,
                                style: TextStyle(
                                  color: Colors.grey[500],
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    const SizedBox(height: 20),

                    // Balance
                    if (wallet != null)
                      _InfoRow(
                        icon: Icons.account_balance_wallet_rounded,
                        label: 'Balance',
                        value: wallet.formattedBalance,
                        valueColor: AppTheme.primaryColor,
                      ),
                    const SizedBox(height: 24),

                    // Status messages
                    if (_successMessage != null)
                      _StatusBanner(
                        message: _successMessage!,
                        isError: false,
                      ),
                    if (_errorMessage != null)
                      _StatusBanner(
                        message: _errorMessage!,
                        isError: true,
                      ),
                    if (_successMessage != null || _errorMessage != null)
                      const SizedBox(height: 16),

                    // Scan button
                    ElevatedButton.icon(
                      onPressed: _isProcessing ? null : _startNfcReceive,
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
                            : 'Tap to Receive via NFC',
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Or ask the sender to tap their device near yours',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.textSecondaryColor,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),

        if (_isScanning)
          Positioned.fill(
            child: NfcScanOverlay(
              message: 'Waiting for sender\'s device…',
              onCancel: _cancelScan,
            ),
          ),
      ],
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({
    required this.icon,
    required this.label,
    required this.value,
    this.valueColor,
  });

  final IconData icon;
  final String label;
  final String value;
  final Color? valueColor;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 20, color: Colors.grey[500]),
        const SizedBox(width: 8),
        Text(
          '$label: ',
          style: TextStyle(fontSize: 14, color: Colors.grey[500]),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: valueColor,
          ),
        ),
      ],
    );
  }
}

class _StatusBanner extends StatelessWidget {
  const _StatusBanner({required this.message, required this.isError});

  final String message;
  final bool isError;

  @override
  Widget build(BuildContext context) {
    final color = isError ? AppTheme.errorColor : AppTheme.successColor;
    final icon = isError ? Icons.error_outline : Icons.check_circle_outline;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              message,
              style: TextStyle(color: color, fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }
}
