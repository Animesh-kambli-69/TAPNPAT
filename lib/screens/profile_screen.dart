import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:tapnpat/providers/wallet_provider.dart';
import 'package:tapnpat/utils/constants.dart';
import 'package:tapnpat/utils/theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        automaticallyImplyLeading: false,
      ),
      body: Consumer<WalletProvider>(
        builder: (context, provider, _) {
          final user = provider.currentUser;
          final wallet = provider.wallet;

          if (user == null) {
            return const Center(child: CircularProgressIndicator());
          }

          return ListView(
            padding: const EdgeInsets.all(AppConstants.defaultPadding),
            children: [
              // Avatar + Name
              Center(
                child: Column(
                  children: [
                    Container(
                      width: 88,
                      height: 88,
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            AppTheme.primaryColor,
                            AppTheme.secondaryColor,
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(
                          user.initials,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 32,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      user.name,
                      style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      user.phone,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[500],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // Wallet summary card
              if (wallet != null)
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.account_balance_wallet_rounded,
                          color: AppTheme.primaryColor,
                          size: 32,
                        ),
                        const SizedBox(width: 16),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Wallet Balance',
                              style: TextStyle(
                                fontSize: 13,
                                color: AppTheme.textSecondaryColor,
                              ),
                            ),
                            Text(
                              wallet.formattedBalance,
                              style: const TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w700,
                                color: AppTheme.primaryColor,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              const SizedBox(height: 24),

              // Info rows
              const _SectionHeader(label: 'Account Info'),
              const SizedBox(height: 8),
              _InfoCard(
                items: [
                  _InfoItem(
                    icon: Icons.person_outline_rounded,
                    label: 'Name',
                    value: user.name,
                  ),
                  _InfoItem(
                    icon: Icons.phone_outlined,
                    label: 'Phone',
                    value: user.phone,
                  ),
                  if (user.email != null)
                    _InfoItem(
                      icon: Icons.email_outlined,
                      label: 'Email',
                      value: user.email!,
                    ),
                  _InfoItem(
                    icon: Icons.nfc_rounded,
                    label: 'NFC ID',
                    value: user.nfcId.substring(0, 8).toUpperCase(),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Transaction stats
              const _SectionHeader(label: 'Statistics'),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: _StatCard(
                      icon: Icons.arrow_upward_rounded,
                      label: 'Sent',
                      value:
                          provider.transactions
                              .where((t) => !t.isCredit)
                              .length
                              .toString(),
                      color: AppTheme.errorColor,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _StatCard(
                      icon: Icons.arrow_downward_rounded,
                      label: 'Received',
                      value:
                          provider.transactions
                              .where((t) => t.isCredit)
                              .length
                              .toString(),
                      color: AppTheme.successColor,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _StatCard(
                      icon: Icons.receipt_long_rounded,
                      label: 'Total',
                      value: provider.transactions.length.toString(),
                      color: AppTheme.primaryColor,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),

              // Sign-out placeholder
              OutlinedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.logout_rounded),
                label: const Text('Sign Out'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppTheme.errorColor,
                  side: const BorderSide(color: AppTheme.errorColor),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({required this.label});
  final String label;

  @override
  Widget build(BuildContext context) {
    return Text(
      label,
      style: const TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.w700,
        color: AppTheme.textSecondaryColor,
        letterSpacing: 0.5,
      ),
    );
  }
}

class _InfoItem {
  const _InfoItem({
    required this.icon,
    required this.label,
    required this.value,
  });
  final IconData icon;
  final String label;
  final String value;
}

class _InfoCard extends StatelessWidget {
  const _InfoCard({required this.items});
  final List<_InfoItem> items;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Column(
          children: [
            for (int i = 0; i < items.length; i++) ...[
              ListTile(
                leading: Icon(items[i].icon, color: AppTheme.primaryColor),
                title: Text(
                  items[i].label,
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppTheme.textSecondaryColor,
                  ),
                ),
                subtitle: Text(
                  items[i].value,
                  style: const TextStyle(
                    fontWeight: FontWeight.w500,
                    fontSize: 14,
                    color: AppTheme.textPrimaryColor,
                  ),
                ),
              ),
              if (i < items.length - 1)
                const Divider(height: 1, indent: 56),
            ],
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  final IconData icon;
  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
        child: Column(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w700,
                color: color,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: const TextStyle(
                fontSize: 11,
                color: AppTheme.textSecondaryColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
