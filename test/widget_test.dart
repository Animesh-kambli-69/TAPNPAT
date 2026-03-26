import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:tapnpat/app.dart';
import 'package:tapnpat/providers/wallet_provider.dart';

void main() {
  group('TapNPatApp Widget Tests', () {
    testWidgets('App renders without errors', (WidgetTester tester) async {
      await tester.pumpWidget(const TapNPatApp());
      // The splash screen should be rendered
      expect(find.byType(MaterialApp), findsOneWidget);
    });

    testWidgets('Splash screen shows app name', (WidgetTester tester) async {
      await tester.pumpWidget(const TapNPatApp());
      await tester.pump(); // Pump a single frame
      expect(find.text('TAPNPAT'), findsWidgets);
    });

    testWidgets('App has correct theme', (WidgetTester tester) async {
      await tester.pumpWidget(const TapNPatApp());
      final MaterialApp app = tester.widget(find.byType(MaterialApp));
      expect(app.debugShowCheckedModeBanner, isFalse);
      expect(app.title, equals('TAPNPAT'));
    });

    testWidgets('WalletProvider is provided to the widget tree',
        (WidgetTester tester) async {
      await tester.pumpWidget(const TapNPatApp());
      final context = tester.element(find.byType(MaterialApp));
      // Should not throw
      final provider = Provider.of<WalletProvider>(context, listen: false);
      expect(provider, isNotNull);
    });
  });
}
