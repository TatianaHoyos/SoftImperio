import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:login/components/my_button.dart';
import 'package:login/components/my_text_field.dart';
import 'package:login/infraestructura/models/response.dart';
import 'package:login/infraestructura/models/usuarios_response.dart';
import 'package:login/pages/formulario_usuarios.dart';
import 'package:http/http.dart' as http;

class Usuarios extends StatefulWidget {
  const Usuarios({super.key});

  @override
  State<Usuarios> createState() => _CampoTextoState();
}

enum Actions { delete, edit }

class _CampoTextoState extends State<Usuarios> {
  late BuildContext currentContext;
  final searchController = TextEditingController();
  List<UsuariosResponse> usuarios = [];
  bool _isLoading = false;


  @override
  void initState() {
    super.initState();
    consumirApiUsuarios();
  }

  @override
  Widget build(BuildContext context) {
     currentContext = context;

    return Scaffold(
      body: Center(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            const SizedBox(height: 25),
            Text(
              'Nuestros Usuarios',
              style: TextStyle(
                  color: const Color.fromARGB(255, 255, 239, 239),
                  fontSize: 20,
                  fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 25),
            MyTextField(
              controller: searchController,
              hintText: 'Buscar',
              secureText: false,
              prefixIcon: Icon(Icons.search),
            ),
            const SizedBox(height: 25),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(
                  width: 150,
                  child: MyButton(
                      onPressed: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const Formulario(
                                      title: 'Form',
                                    )));
                      },
                      text: 'Agregar'),
                ),
                SizedBox(
                  width: 150,
                  child: MyButton(onPressed: () {}, text: 'Reporte'),
                ),
              ],
            ),
            const SizedBox(height: 25),
            Expanded(
              child: mostrarListaUsuarios(),
            )
          ],
        ),
      ),
      floatingActionButton: _isLoading
          ? const AlertDialog(
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16.0),
                  Text('Cargando...'),
                ],
              ),
            ) // Muestra el modal si isLoading es verdadero
          : Container(), // Oculta el modal si isLoading es falso,
    );
  }

  ListView mostrarListaUsuarios() {
    return ListView.builder(
        itemCount: usuarios.length + 1,
        physics: const BouncingScrollPhysics(),
        itemBuilder: (context, index) {
          if (index == 0) {
            return buildHeaderList();
          }
          index -= 1;
          final user = usuarios[index];
          return Slidable(
            startActionPane: ActionPane(
              motion: const StretchMotion(),
              children: [
                SlidableAction(
                  backgroundColor: Colors.lightBlueAccent,
                  icon: Icons.edit,
                  label: 'Editar',
                  onPressed: (context) => onEditarUsuario(context, index),
                )
              ],
            ),
            endActionPane: ActionPane(motion: const BehindMotion(), children: [
              SlidableAction(
                backgroundColor: Colors.redAccent,
                icon: Icons.delete,
                label: 'Eliminar',
                onPressed: (context) => onEliminarUsuario(context, index),
              )
            ]),
            child: buildItemList(user),
          );
        });
  }

  Widget buildItemList(UsuariosResponse usuario) => Container(
        decoration: BoxDecoration(
            border: Border(bottom: BorderSide(color: Colors.grey.shade400))),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Expanded(
                  child: Text(usuario.nombre,
                      style: TextStyle(color: Colors.white))),
              Expanded(
                  child: Text(usuario.documento,
                      style: TextStyle(color: Colors.white))),
              Expanded(
                  child: Text(usuario.email,
                      style: TextStyle(color: Colors.white))),
              Expanded(
                  child: Text(usuario.telefono,
                      style: TextStyle(color: Colors.white)))
            ],
          ),
        ),
      );
  Widget buildHeaderList() => Container(
        decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(5),
            color: Color(0xffe9b689),
            border: Border.all(
                color: Colors.transparent, width: 1, style: BorderStyle.solid)),
        //color: Color(0xffe9b689),
        child: const Padding(
          padding: EdgeInsets.all(16),
          child: Row(
            children: [
              Expanded(child: Text('nombre')),
              Expanded(child: Text('documento')),
              Expanded(child: Text('correo')),
              Expanded(child: Text('telefono'))
            ],
          ),
        ),
      );

  void onEditarUsuario(BuildContext context, int index) {
    final usuario = usuarios[index];

    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => Formulario(title: 'Form', usuario: usuario)));
  }

  void onEliminarUsuario(BuildContext context, int index) {

    Widget cancelButton(BuildContext context) => TextButton(
          child: Text("Cancel"),
          onPressed: () => Navigator.pop(context, false),
        );
    Widget continueButton(BuildContext context) => TextButton(
          child: Text("Continue"),
          onPressed: () => accionEliminar(context, index),
        );

    // set up the AlertDialog
    AlertDialog alert(BuildContext context) => AlertDialog(
          title: Text("Eliminar Usuario"),
          content: Text('Seguro de eliminar a ${usuarios[index].nombre} \n'
          +' con ducumento: ${usuarios[index].documento}'),
          actions: [
            cancelButton(context),
            continueButton(context),
          ],
        );

    // show the dialog
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (BuildContext context) {
        return alert(context);
      },
    );
  }

  void accionEliminar(BuildContext context, int index) async {
    Navigator.pop(context, false);
    // Almacena el contexto en una variable antes de llamar a la función asíncrona
 
    final usuario = usuarios[index];
    var result = await apiEliminarUsuario(usuario.idUsuarios);
    if (result.status == 'exito') {
      _mostrarAlerta(
          currentContext,
          result,
          () {
            Navigator.of(currentContext).pop();
            setState(() {
              usuarios.removeAt(index);
            });
          },
        );
    } else {
      _mostrarAlerta(
          currentContext,
          result,
          () {
            Navigator.of(currentContext).pop();
          },
        );
    }
  }

  Future<void> consumirApiUsuarios() async {
    setState(() {
      _isLoading = true;
    });
    final url = Uri.parse('http://localhost:8080/api/usuarios/consultar');
    final headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    try {
      final response = await http.get(url, headers: headers);

      if (response.statusCode == 200) {
        setState(() {
          usuarios = usuariosResponseFromJson(response.body);
          _isLoading = false;
        });
      } else {
        //usuarios=[];
      }
    } catch (e) {
      // Oculta el modal cuando se recibe la respuesta de la API
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<Response> apiEliminarUsuario(int idUsuario) async {
    setState(() {
      _isLoading = true;
    });
    final url = Uri.parse(
        'http://localhost:8080/api/usuarios/eliminar/' + idUsuario.toString());
    final headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      final response = await http.delete(url, headers: headers);
      // Oculta el modal cuando se recibe la respuesta de la API
     // ocultarCargando();
     var responseError = Response.fromJson(jsonDecode(response.body));
     return responseError;

  
    } catch (e) {
      // Oculta el modal cuando se recibe la respuesta de la API
     //ocultarCargando();
      print('Error: $e');
      // Manejo de errores de red u otros
      return Response(
              message: "Error al consumir el API de Eliminar usuario",
              status: "Error");
    
    } finally {
      ocultarCargando();
    }
  }

  void ocultarCargando() {
    setState(() {
      _isLoading = false;
    });
  }

  void _mostrarAlerta(
      BuildContext context, Response? response, Function() onPressed) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(response!.status),
          content: Text(response.message),
          actions: [
            ElevatedButton(
              onPressed: onPressed,
              child: Text('Aceptar'),
            ),
          ],
        );
      },
    );
  }
}
