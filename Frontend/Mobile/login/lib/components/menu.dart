import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:login/components/loading.dart';
import 'package:login/infraestructura/models/response.dart';
import 'package:login/util/auth_singleton.dart';
import 'package:login/util/gateway.dart';
import 'package:login/util/host_server.dart';

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
            /*DrawerHeader(
              decoration: const BoxDecoration (
                 color: Color.fromARGB(255, 37, 35, 35),
              ),
              child:Column(
                children: [
                  Image.asset('assets/images/logo.png', width: 130),
                ],
              ),
              
            ),*/
            Material(
              color: Color.fromARGB(255, 37, 35, 35),
                child: Container(
                  padding: EdgeInsets.only(
                      top: MediaQuery.of(context).padding.top,
                      bottom: 24
                  ),
                  child: Column(
                    children: [
                       CircleAvatar(
                        radius: 52,
                        backgroundColor: Color.fromARGB(255, 37, 35, 35),
                        child: Image.asset('assets/images/logo.png'),
                      ),
                      SizedBox(height: 12,),
                      Row(
                        mainAxisSize: MainAxisSize.max,
                        verticalDirection: VerticalDirection.down,
                        children: [
                          SizedBox(width: 12,),
                          CircleAvatar(
                      radius: 24, // Slightly larger for border
                      backgroundColor: Colors.white, // Change to your border color
                      child: CircleAvatar(
                        radius: 22,
                        backgroundColor: Color.fromARGB(255, 37, 35, 35),
                         child: ClipOval(
                           child: Image.network(
                            hostImage + AuthSingleton().foto,
                            errorBuilder:
                                (BuildContext context, Object error, StackTrace? stackTrace) {
                              // En caso de error al cargar la imagen, mostrar una imagen por defecto
                              return Image.asset(
                                'assets/images/logo.png',
                              );
                            },
                                                   ),
                         ),
                      ),
                    ),
                    SizedBox(width: 12,),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              FittedBox(
                                    fit: BoxFit.scaleDown,
                                    child:Text(AuthSingleton().nombre,
                                style: const TextStyle(
                                    fontSize: 28,
                                    color: Colors.white
                                ),)),
                               Text(AuthSingleton().rol,
                                style: const TextStyle(
                                    fontSize: 14,
                                    color: Colors.white
                                ),),
                            ],
                          ),
                        ],
                      ),

                    ],
                  ),
                ),
            ),
            Container(
              decoration: BoxDecoration(
              border: Border(bottom: BorderSide(
                color: Colors.grey.shade400
              ))
            ),
              child: ListTile(
                leading: Icon(Icons.logout, color: Color(0xFFAE9243), ),
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
      Loading loading  = Loading();
     showDialog(
      context: context,
      builder: (BuildContext context) {
        return loading;
      },
    );
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
      loading.hideLoadingDialog();
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
      loading.hideLoadingDialog();
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