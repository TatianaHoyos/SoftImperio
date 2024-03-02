import 'package:flutter/material.dart';
import 'package:test_app_flutter/screens/punto_de_venta_screen/punto_venta_screen.dart';

void main() {
  runApp(const PuntoDeVentaMesaApp());
}

class PuntoDeVentaMesaApp extends StatelessWidget {
  const PuntoDeVentaMesaApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var customTheme = ThemeData(
      primarySwatch: Colors.deepPurple,
      colorScheme: ColorScheme.fromSwatch(
        primarySwatch: Colors.deepPurple,
      ),
      visualDensity: VisualDensity.adaptivePlatformDensity,
    );

    return MaterialApp(
      title: 'Punto de Venta Mesa',
      theme: customTheme,
      initialRoute: "/punto_venta",
      routes: {'/punto_venta': (context) => SellingPointScreen()},
     // home: PuntoVentaScsreen(),
    );
  }
}

