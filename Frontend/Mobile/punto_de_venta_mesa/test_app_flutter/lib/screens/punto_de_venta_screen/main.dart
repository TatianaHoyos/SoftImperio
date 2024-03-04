import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:test_app_flutter/provider/cart_provider.dart';
import 'package:test_app_flutter/provider/products_provider.dart';
import 'package:test_app_flutter/screens/pedido_productos_screen/cart_screen.dart';
import 'package:test_app_flutter/screens/punto_de_venta_screen/punto_venta_screen.dart';


void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var customTheme = ThemeData(
      primarySwatch: Colors.green,
      colorScheme: ColorScheme.fromSwatch(
        primarySwatch: Colors.deepPurple,
      ),
      visualDensity: VisualDensity.adaptivePlatformDensity,
    );

    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => ProductProvider()),
        ChangeNotifierProvider(create: (context) => CartProvider()),
      ],
      child: MaterialApp(
        title: 'Punto de Venta Mesa',
      //  theme: customTheme,
        initialRoute: "/",
        routes: { '/': (context) => SellingPointScreen(),//indica ruta principal
          '/punto_venta': (context) => SellingPointScreen(),
          '/screen_carrito': (context) => MyCart()},
      ),
    );
  }
}
