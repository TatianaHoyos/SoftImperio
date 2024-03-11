import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:login/infraestructura/models/response.dart';
import 'package:login/util/gateway.dart';

class Menu extends StatefulWidget {
  const Menu({super.key});

  @override
  State<Menu> createState() => _MenuState();
}

class _MenuState extends State<Menu> {
  @override
  Widget build(BuildContext context) {
    return Drawer(
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
                leading: Icon(Icons.create, color: Color(0xFFAE9243), ),
                title:Text('Cerrar sesion', style: TextStyle(color: Colors.white),) ,
               
                 onTap: (){
                  //acá hay que cerrar sesion
                  consumirApiLogout(context);
                },
              ),
            ),
          ],
        ),
      );
  }

    Future<void> consumirApiLogout(BuildContext context) async {
    /*setState(() {
      _isLoading = true;
    });*/
    final gateway = Gateway();
    const url = '/edge-service/v1/authorization/logout';
    var headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  var body = {
    'accessToken': "",
  };
    try {
      final response = await gateway.makeRequest(
          endpoint: url,
          method: 'POST',
          headers: headers,
          body: body,
          isLogout: true);

// Oculta el modal cuando se recibe la respuesta de la API
    /*  setState(() {
        _isLoading = false;
      });
*/
      if (response.statusCode == 200) {
        Navigator.pushReplacementNamed(context, '/');
      } else {
        _mostrarAlerta(context, Response(
              message: "Error al consumir el API de logout", status: "Error"));
      }
    } catch (e) {
      // Oculta el modal cuando se recibe la respuesta de la API
      /*setState(() {
        _isLoading = false;
      });*/
      // Manejo de errores de red u otros
      _mostrarAlerta(
          context,
          Response(
              message: "Error al consumir el API de logout", status: "Error"));
      print('Error: $e');
    }
  }

  void _mostrarAlerta(BuildContext context, Response? response) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(response!.status),
          content: Text(response.message),
          actions: [
            ElevatedButton(
              onPressed: () {
                // Cierra la alerta cuando se presiona "Aceptar"
                Navigator.of(context).pop();
              },
              child: Text('Aceptar'),
            ),
          ],
        );
      },
    );
  }
}