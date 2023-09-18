import 'package:flutter/material.dart';
import 'package:login/components/my_button.dart';
import 'package:login/components/my_text_field.dart';
import 'package:login/pages/inicio_page.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import '../infraestructura/models/response.dart';
import '../infraestructura/models/usuario.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();
  bool enableButton = false;
  bool _isLoading = false;
  Usuario? usuario;
  Response? response;

  String? get _errorPasswordText {
    final text = passwordController.value.text;
    String pattern = r'^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8}$';
    RegExp regExp = RegExp(pattern);
    if (text.isEmpty) {
      return "La contraseña es necesaria";
    } else if (!regExp.hasMatch(text)) {
      return "La contraseña debe tener al menos 8 caracteres, 1 letra mayúscula, 1 minúscula y 1 número. Además puede contener caracteres especiales.";
    } else {
      return null;
    }
  }

  @override
  void initState() {
    super.initState();
    usernameController.addListener(() {
      validateEmptyTextField();
    });
    passwordController.addListener(() {
      validateEmptyTextField();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
          child: SingleChildScrollView(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const SizedBox(height: 50),
              //logo
              Image.asset('assets/images/logo.png', width: 200),

              MyTextField(
                controller: usernameController,
                hintText: 'Ingresa tu Usuario',
                secureText: false,
                prefixIcon: Icon(Icons.person_2_rounded),
              ),
              const SizedBox(height: 10),
              //campo de texto para el password
              MyTextField(
                controller: passwordController,
                hintText: 'Ingresa tu Contraseña',
                errorText: passwordController.value.text.isNotEmpty
                    ? _errorPasswordText
                    : null,
                secureText: true,
                prefixIcon: Icon(Icons.remove_red_eye),
              ),
              const SizedBox(height: 25),
              MyButton(
                text: 'Ingresar',
                onPressed: enableButton
                    ? () {
                        onclickLogin(context);
                      }
                    : null,
              ),
              const SizedBox(height: 10),
              const Padding(
                padding: const EdgeInsets.symmetric(horizontal: 25.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Recuperar contraseña',
                      style: TextStyle(
                          color: Colors.white,
                          decoration: TextDecoration.underline),
                    ),
                  ],
                ),
              )
            ],
          ),
        ),
      )),
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
          : Container(), // Oculta el modal si isLoading es falso
    );
  }

  void validateEmptyTextField() {
    setState(() {
      enableButton = (passwordController.value.text.isNotEmpty &&
          usernameController.value.text.isNotEmpty);
    });
  }

  void onclickLogin(BuildContext context) {
    if (_errorPasswordText == null) {
      consumirApiLogin(usernameController.value.text,
          passwordController.value.text, context);
    }
  }

  Future<void> consumirApiLogin(
      String correo, String password, BuildContext context) async {
    setState(() {
      _isLoading = true;
    });
    final url = Uri.parse('http://localhost:8080/api/login');
    final headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    final body = jsonEncode({
      'correo': usernameController.value.text,
      'password': passwordController.value.text,
    });

    try {
      final response = await http.post(url, headers: headers, body: body);

// Oculta el modal cuando se recibe la respuesta de la API
      setState(() {
        _isLoading = false;
      });

      if (response.statusCode == 200) {
        usuario = Usuario.fromJson(jsonDecode(response.body));
        Navigator.push(
            context, MaterialPageRoute(builder: (context) => const Inicio()));
      } else {
        this.response = Response.fromJson(jsonDecode(response.body));
        _mostrarAlerta(context, this.response);
      }
    } catch (e) {
      // Oculta el modal cuando se recibe la respuesta de la API
      setState(() {
        _isLoading = false;
      });
      // Manejo de errores de red u otros
      _mostrarAlerta(
          context,
          Response(
              message: "Error al consumir el API de login", status: "Error"));
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
