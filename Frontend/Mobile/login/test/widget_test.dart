// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:login/main.dart';
import 'package:login/pages/inicio_page.dart';
import 'package:login/pages/login_page.dart';
import 'package:login/pages/pedido_productos_screen/cart_screen.dart';
import 'package:login/pages/punto_de_venta_screen/punto_venta_screen.dart';
import 'package:provider/provider.dart';

void main() {
  testWidgets('MyApp Widget Test', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());
    
    // Verifica que el widget MaterialApp esté presente
    expect(find.byType(MaterialApp), findsOneWidget);
    
    // Verifica que el widget MultiProvider esté presente
    expect(find.byType(MultiProvider), findsOneWidget);
    
    // Verifica que el widget LoginPage esté presente
    expect(find.byType(LoginPage), findsOneWidget);
    
  });
}
