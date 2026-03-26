import 'package:flutter/material.dart';
import 'package:tapnpat/app.dart';
import 'package:tapnpat/services/storage_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await StorageService.instance.init();
  runApp(const TapNPatApp());
}
