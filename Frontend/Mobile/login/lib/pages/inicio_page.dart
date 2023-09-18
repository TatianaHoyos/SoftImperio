import 'package:flutter/material.dart';
import 'package:login/pages/formulario_usuarios.dart';
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
        title: Text(''),
      ),
      body: Usuarios(),
      drawer: Drawer(
        backgroundColor: Color(0xFF2e3037),
        child: ListView(
          padding: EdgeInsets.zero,
          children:<Widget> [
            DrawerHeader(
              decoration: BoxDecoration (
                 color: const Color.fromARGB(255, 37, 35, 35),
              ),
              child: Column(
                children: [
                
                  Image.asset('assets/images/logo.png', width: 130),
                ],
              ),
              
            ),
            Container(
              decoration: BoxDecoration(
              border: Border(bottom: BorderSide(
                color: Colors.grey.shade400
              ))
            ),
              child: ListTile(
                leading: Icon(Icons.create, color: Color(0xffe9b689), ),
                title:Text('Registrar Usuario', style: TextStyle(color: Colors.white),) ,
               
                 onTap: (){
                  Navigator.push(context,
                    MaterialPageRoute(builder: (context)=>const Formulario(title: ''))
                    );
                },
              ),
            ),
          ],
        ),
      ),

    );
  }
}