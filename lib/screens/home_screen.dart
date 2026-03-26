import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:tapnpat/providers/wallet_provider.dart';
import 'package:tapnpat/screens/profile_screen.dart';
import 'package:tapnpat/screens/receive_payment_screen.dart';
import 'package:tapnpat/screens/send_payment_screen.dart';
import 'package:tapnpat/screens/transaction_history_screen.dart';
import 'package:tapnpat/utils/constants.dart';
import 'package:tapnpat/utils/theme.dart';
import 'package:tapnpat/widgets/balance_card.dart';
import 'package:tapnpat/widgets/transaction_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<WalletProvider>().initialize();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: const [
          _DashboardTab(),
          TransactionHistoryScreen(),
          ProfileScreen(),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (i) => setState(() => _selectedIndex = i),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home_rounded),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.receipt_long_outlined),
            selectedIcon: Icon(Icons.receipt_long_rounded),
            label: 'History',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline_rounded),
            selectedIcon: Icon(Icons.person_rounded),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}

class _DashboardTab extends StatelessWidget {
  const _DashboardTab();

  @override
  Widget build(BuildContext context) {
    return Consumer<WalletProvider>(
      builder: (context, provider, _) {
        if (provider.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (provider.state == WalletState.error) {
          return Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.error_outline, size: 48, color: Colors.red),
                const SizedBox(height: 12),
                Text(provider.errorMessage ?? 'Unknown error'),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => provider.initialize(),
                  child: const Text('Retry'),
                ),
              ],
            ),
          );
        }

        final wallet = provider.wallet;
        final user = provider.currentUser;
        final recentTransactions =
            provider.transactions.take(5).toList();

        return RefreshIndicator(
          onRefresh: provider.refresh,
          child: CustomScrollView(
            slivers: [
              SliverAppBar(
                pinned: true,
                expandedHeight: 56,
                title: const Text(AppConstants.appName),
                actions: [
                  IconButton(
                    icon: const Icon(Icons.notifications_none_rounded),
                    onPressed: () {},
                    tooltip: 'Notifications',
                  ),
                ],
              ),
              SliverPadding(
                padding: const EdgeInsets.all(AppConstants.defaultPadding),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    // Balance card
                    if (wallet != null && user != null)
                      BalanceCard(
                        wallet: wallet,
                        userName: user.name,
                        onSend: () => Navigator.push(
                          context,
                          MaterialPageRoute<void>(
                            builder: (_) => const SendPaymentScreen(),
                          ),
                        ).then((_) => provider.refresh()),
                        onReceive: () => Navigator.push(
                          context,
                          MaterialPageRoute<void>(
                            builder: (_) => const ReceivePaymentScreen(),
                          ),
                        ).then((_) => provider.refresh()),
                      ),
                    const SizedBox(height: 24),

                    // Quick actions
                    _QuickActionsRow(
                      onNfcSend: () => Navigator.push(
                        context,
                        MaterialPageRoute<void>(
                          builder: (_) => const SendPaymentScreen(),
                        ),
                      ).then((_) => provider.refresh()),
                      onNfcReceive: () => Navigator.push(
                        context,
                        MaterialPageRoute<void>(
                          builder: (_) => const ReceivePaymentScreen(),
                        ),
                      ).then((_) => provider.refresh()),
                    ),
                    const SizedBox(height: 24),

                    // Recent transactions
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Recent Transactions',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        TextButton(
                          onPressed: () {},
                          child: const Text('See all'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    if (recentTransactions.isEmpty)
                      _EmptyTransactions()
                    else
                      ...recentTransactions.map(
                        (t) => Padding(
                          padding: const EdgeInsets.only(bottom: 4),
                          child: TransactionCard(transaction: t),
                        ),
                      ),
                    const SizedBox(height: 16),
                  ]),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _QuickActionsRow extends StatelessWidget {
  const _QuickActionsRow({
    required this.onNfcSend,
    required this.onNfcReceive,
  });

  final VoidCallback onNfcSend;
  final VoidCallback onNfcReceive;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _QuickAction(
            icon: Icons.nfc_rounded,
            label: 'NFC Pay',
            color: AppTheme.primaryColor,
            onTap: onNfcSend,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _QuickAction(
            icon: Icons.qr_code_scanner_rounded,
            label: 'NFC Receive',
            color: AppTheme.accentColor,
            onTap: onNfcReceive,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _QuickAction(
            icon: Icons.history_rounded,
            label: 'History',
            color: AppTheme.secondaryColor,
            onTap: () {},
          ),
        ),
      ],
    );
  }
}

class _QuickAction extends StatelessWidget {
  const _QuickAction({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class _EmptyTransactions extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.receipt_long_outlined,
            size: 56,
            color: Colors.grey[300],
          ),
          const SizedBox(height: 12),
          Text(
            'No transactions yet',
            style: TextStyle(color: Colors.grey[500], fontSize: 14),
          ),
          const SizedBox(height: 4),
          Text(
            'Tap to send or receive payments via NFC',
            style: TextStyle(color: Colors.grey[400], fontSize: 12),
          ),
        ],
      ),
    );
  }
}
