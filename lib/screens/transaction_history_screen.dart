import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:tapnpat/models/transaction.dart';
import 'package:tapnpat/providers/wallet_provider.dart';
import 'package:tapnpat/utils/constants.dart';
import 'package:tapnpat/widgets/transaction_card.dart';

class TransactionHistoryScreen extends StatelessWidget {
  const TransactionHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Transaction History'),
          automaticallyImplyLeading: false,
          bottom: const TabBar(
            tabs: [
              Tab(text: 'All'),
              Tab(text: 'Sent'),
              Tab(text: 'Received'),
            ],
            labelColor: Colors.white,
            unselectedLabelColor: Colors.white70,
            indicatorColor: Colors.white,
          ),
        ),
        body: Consumer<WalletProvider>(
          builder: (context, provider, _) {
            if (provider.isLoading) {
              return const Center(child: CircularProgressIndicator());
            }

            return TabBarView(
              children: [
                _TransactionList(transactions: provider.transactions),
                _TransactionList(
                  transactions: provider.transactions
                      .where((t) => t.type == TransactionType.send)
                      .toList(),
                ),
                _TransactionList(
                  transactions: provider.transactions
                      .where((t) => t.type == TransactionType.receive)
                      .toList(),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _TransactionList extends StatelessWidget {
  const _TransactionList({required this.transactions});

  final List<Transaction> transactions;

  @override
  Widget build(BuildContext context) {
    if (transactions.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.receipt_long_outlined,
              size: 64,
              color: Colors.grey[300],
            ),
            const SizedBox(height: 12),
            Text(
              'No transactions',
              style: TextStyle(color: Colors.grey[500], fontSize: 15),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => context.read<WalletProvider>().refresh(),
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(
          vertical: AppConstants.defaultPadding,
        ),
        itemCount: transactions.length,
        separatorBuilder: (_, __) => const SizedBox(height: 4),
        itemBuilder: (_, index) =>
            TransactionCard(transaction: transactions[index]),
      ),
    );
  }
}
