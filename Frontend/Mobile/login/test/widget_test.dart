// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:login/main.dart';
import 'package:provider/provider.dart';

void main() {
  testWidgets('MyApp Widget Test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const MyApp());

    // Verify that MyApp contains a MaterialApp widget.
    expect(find.byType(MaterialApp), findsOneWidget);

    // Verify that the MaterialApp widget contains a MultiProvider widget.
    expect(find.byType(MultiProvider), findsOneWidget);

    // Verify that the MultiProvider widget contains a MaterialApp widget.
    expect(find.byType(MaterialApp), findsOneWidget);

    // Verify that the MaterialApp widget has the correct routes defined.
    //expect(find.byKey(const Key('/')), findsOneWidget);
    expect(find.byKey(const Key('/punto_venta')), findsOneWidget);
    expect(find.byKey(const Key('/screen_carrito')), findsOneWidget);
    expect(find.byKey(const Key('/inicio')), findsOneWidget);

  });
}
