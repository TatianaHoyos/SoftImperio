import 'package:flutter/material.dart';
import 'package:login/components/colors.dart';
import 'package:login/pages/formulario_usuarios.dart';
import 'package:login/pages/login_page.dart';
import 'package:login/pages/mensaje_page.dart';
import 'package:login/pages/inicio_page.dart';
import 'package:login/pages/usuarios.dart';
import 'package:login/theme.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
     debugShowCheckedModeBanner: false,
     theme: AppTheme().theme,
      home: LoginPage(),
     //Formulario(title: 'Form',),
     //Inicio(),
    );
  }
}