import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:login/components/colors.dart';
import 'package:login/infraestructura/provider/cart_provider.dart';
import 'package:login/pages/formulario_usuarios.dart';
import 'package:login/pages/login_page.dart';
import 'package:login/pages/inicio_page.dart';
import 'package:login/pages/pedido_productos_screen/cart_screen.dart';
import 'package:login/pages/punto_de_venta_screen/punto_venta_screen.dart';
import 'package:login/pages/usuarios.dart';
import 'package:login/theme.dart';
import 'package:provider/provider.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown
  ]).then((value) =>  runApp(const MyApp()));
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => CartProvider()),
      ],
      child:  MaterialApp(
     debugShowCheckedModeBanner: false,
     theme: AppTheme().theme,
     initialRoute: "/",
        routes: { '/': (context) => LoginPage(),//indica ruta principal
          '/punto_venta': (context) => SellingPointScreen(),
          '/screen_carrito': (context) => MyCart(),
          '/inicio': (context) => Inicio()
          },
    )
    );
  }
}