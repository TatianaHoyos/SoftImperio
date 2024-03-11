import 'package:flutter/material.dart';
import 'package:login/components/menu.dart';
import 'package:login/pages/formulario_usuarios.dart';
import 'package:login/pages/punto_de_venta_screen/punto_venta_screen.dart';
import 'package:login/pages/usuarios.dart';

class Inicio extends StatefulWidget {
  const Inicio({super.key});

  @override
  State<Inicio> createState() => _InicioState();
}

class _InicioState extends State<Inicio> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
       title: const Text("Punto de Venta",
                style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFAE9243))),
      ),
      body: SellingPointScreen(),
      drawer: Menu(),

    );
  }
}