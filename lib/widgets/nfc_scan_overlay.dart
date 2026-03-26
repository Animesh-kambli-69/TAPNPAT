import 'package:flutter/material.dart';
import 'package:tapnpat/utils/theme.dart';

/// A full-screen overlay shown while an NFC scan is in progress.
class NfcScanOverlay extends StatefulWidget {
  const NfcScanOverlay({
    super.key,
    required this.message,
    this.onCancel,
  });

  final String message;
  final VoidCallback? onCancel;

  @override
  State<NfcScanOverlay> createState() => _NfcScanOverlayState();
}

class _NfcScanOverlayState extends State<NfcScanOverlay>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.black.withOpacity(0.75),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Pulsing NFC icon
            ScaleTransition(
              scale: _pulseAnimation,
              child: Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withOpacity(0.15),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: AppTheme.accentColor,
                    width: 3,
                  ),
                ),
                child: const Icon(
                  Icons.nfc_rounded,
                  size: 64,
                  color: AppTheme.accentColor,
                ),
              ),
            ),
            const SizedBox(height: 32),
            Text(
              widget.message,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Hold the device near the NFC tag',
              style: TextStyle(
                color: Colors.white70,
                fontSize: 13,
              ),
            ),
            const SizedBox(height: 36),
            OutlinedButton.icon(
              onPressed: widget.onCancel,
              icon: const Icon(Icons.close, color: Colors.white70),
              label: const Text(
                'Cancel',
                style: TextStyle(color: Colors.white70),
              ),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Colors.white38),
                minimumSize: const Size(140, 44),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
