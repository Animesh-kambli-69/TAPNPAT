import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:tapnpat/providers/wallet_provider.dart';
import 'package:tapnpat/screens/home_screen.dart';
import 'package:tapnpat/screens/splash_screen.dart';
import 'package:tapnpat/utils/constants.dart';
import 'package:tapnpat/utils/theme.dart';

class TapNPatApp extends StatelessWidget {
  const TapNPatApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => WalletProvider()),
      ],
      child: MaterialApp(
        title: AppConstants.appName,
        theme: AppTheme.lightTheme,
        debugShowCheckedModeBanner: false,
        initialRoute: '/',
        routes: {
          '/': (_) => const SplashScreen(),
          '/home': (_) => const HomeScreen(),
        },
      ),
    );
  }
}
