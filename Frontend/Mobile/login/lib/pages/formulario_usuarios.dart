import 'dart:convert';
import 'dart:io';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:http_parser/http_parser.dart';
import 'package:login/components/my_button.dart';
import 'package:login/components/my_dropdown.dart';
import 'package:login/components/my_text_field.dart';
import 'package:login/infraestructura/models/response.dart';
import 'package:login/infraestructura/models/roles.dart';
import 'package:login/pages/inicio_page.dart';
import 'package:file_picker/file_picker.dart';
import 'package:http/http.dart' as http;
import 'package:mime/mime.dart';

GlobalKey<FormState> keyForm = new GlobalKey();

class Formulario extends StatefulWidget {
  const Formulario({super.key, required this.title});
  final String title;

  @override
  State<Formulario> createState() => _FormularioState();
}

class _FormularioState extends State<Formulario> {
  final nameCtrl = TextEditingController();
  final documentCtrl = TextEditingController();
  final emailCtrl = TextEditingController();
  final mobileCtrl = TextEditingController();
  final fotoCtrl = TextEditingController();
  //final rolCtrl = DropdownController<String>('j');
  String? selectedRol;
  PlatformFile? _selectedFile;

  bool _isLoading = false;
  bool enableButton = false;
  List<Roles> roles = [];
  List<String> rolesList = [];

  String? get validateName {
    final name = nameCtrl.value.text;
    String pattern = r'(^[a-zA-Z ]*$)';
    RegExp regExp = new RegExp(pattern);
    if (name.isEmpty) {
      return "El nombre es necesario";
    } else if (!regExp.hasMatch(name)) {
      return "El nombre debe de ser a-z y A-Z";
    }
    return null;
  }

  String? get validateDocumento {
    final validateDocumento = documentCtrl.value.text;
    String patttern = r'(^[0-9]*$)';
    RegExp regExp = new RegExp(patttern);
    if (!regExp.hasMatch(validateDocumento)) {
      return "No se permiten letras";
    } else if (validateDocumento.length != 10) {
      return "El numero debe tener 10 digitos";
    }
    return null;
  }

  String? get validateTelefono {
    final validateTelefono = mobileCtrl.value.text;
    String patttern = r'(^[0-9]*$)';
    RegExp regExp = new RegExp(patttern);
    if (!regExp.hasMatch(validateTelefono)) {
      return "No se permiten letras";
    } else if (validateTelefono.length != 10) {
      return "El numero debe tener 10 digitos";
    }
    return null;
  }

  String? get validateEmail {
    final validateEmail = emailCtrl.value.text;
    String patttern =
        r'^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$';
    RegExp regExp = new RegExp(patttern);
    if (validateEmail.length == 0) {
      return "El correo es necesario";
    } else if (!regExp.hasMatch(validateEmail)) {
      return "Correo invalido";
    } else {
      return null;
    }
  }

  String? get validateRol {
    //final selectedRol = rolCtrl.selectedValue.value;
    if (selectedRol == null) {
      return 'Seleccione un rol';
    }
    return null;
  }

  String? get validateFoto {
    //final selectedRol = rolCtrl.selectedValue.value;
    if (_selectedFile == null) {
      return "Debe seleccionar una foto";
    }
    return null;
  }

  @override
  void initState() {//evento de cuando se inicia la pantalla
    super.initState();
    apiConsultarRoles(context);
   
    nameCtrl.addListener(() {
      validateEmptyTextField();
    });
    documentCtrl.addListener(() {
      validateEmptyTextField();
    });
    emailCtrl.addListener(() {
      validateEmptyTextField();
    });
    mobileCtrl.addListener(() {
      validateEmptyTextField();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Usuarios')),
      body: SingleChildScrollView(
          child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
            const SizedBox(height: 50),
            const Text(
              'Nuevo Usuario',
              style: TextStyle(
                  color: Color.fromARGB(255, 255, 239, 239),
                  fontSize: 20,
                  fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 25),
            MyTextField(
              controller: nameCtrl,
              hintText: 'Nombre',
              errorText: validateName,
              secureText: false,
              prefixIcon: Icon(Icons.person),
            ),
            const SizedBox(height: 10),
            MyTextField(
              controller: documentCtrl,
              hintText: 'Documento',
              errorText: validateDocumento,
              secureText: false,
              prefixIcon: Icon(Icons.verified_user),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 10),
            MyTextField(
              controller: emailCtrl,
              hintText: 'Correo',
              errorText: validateEmail,
              secureText: false,
              prefixIcon: Icon(Icons.email),
            ),
            const SizedBox(height: 10),
            MyTextField(
              controller: mobileCtrl,
              hintText: 'Telefono',
              errorText: validateTelefono,
              secureText: false,
              prefixIcon: Icon(Icons.phone),
            ),
            const SizedBox(height: 10),
            MyDropDown(
              items: rolesList,
              hintText: 'Rol',
              errorText: validateRol,
              prefixIcon: Icon(Icons.verified_user),
              onChanged: (value) {
                setState(() {
                  selectedRol = value;
                });
              },
            ),
            const SizedBox(height: 10),
            GestureDetector(
              onTap: () {
                _pickFile();
              },
              child: MyTextField(
                controller: fotoCtrl,
                hintText: 'Seleccione una foto',
                errorText: validateFoto,
                secureText: false,
                prefixIcon: Icon(Icons.camera_alt_outlined),
                enable: false,
              ),
            ),
            const SizedBox(height: 10),
            MyButton(
              text: 'Registrar',
              onPressed: enableButton
                  ? () {
                      onclickLogin(context);
                    }
                  : null,
            ),
          ])),
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
          : Container(),
    );
  }

  void validateEmptyTextField() {
    setState(() {
      enableButton = (validateName == null &&
          validateDocumento == null &&
          validateEmail == null &&
          validateTelefono == null &&
          selectedRol != null &&
          _selectedFile != null);
    });
  }

  void onclickLogin(BuildContext context) {
    if(enableButton){
        apiRegistrarUsuario(context);
      // Navigator.push(
      //   context, MaterialPageRoute(builder: (context) => const Inicio())
      //   );
    }
  }

  void _pickFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles();

    if (result != null) {
      setState(() {
        _selectedFile = result.files.first;
        if (_selectedFile != null) {
          fotoCtrl.text = _selectedFile!.name;
          validateFoto;
        }
      });
    }
  }

  bool isWeb() {
  return Platform.isAndroid || Platform.isIOS ? false : true;
}

  Future<void> apiConsultarRoles(BuildContext context) async {
    setState(() {
      _isLoading = true;
    });

    final url = Uri.parse('http://localhost:8080/api/roles');
    final headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) {
        // rol= Roles.fromJson(jsonDecode(response.body));
        // Parsea la respuesta a una lista de roles
        roles = rolesFromJson(response.body);
        // Itera sobre la lista y obtén los nombres de rol
        for (var rol in roles) {
          String nombreRol = rol.nombreRol;
          rolesList.add(nombreRol);
        }
      ocultarCargando();
      } else {
        ocultarCargando();
        var responseError = Response.fromJson(jsonDecode(response.body));
        _mostrarAlerta(context, responseError,(){
                // Cierra la alerta cuando se presiona "Aceptar"
                Navigator.of(context).pop();
              });
      }
      // Oculta el modal cuando se recibe la respuesta de la API
    } catch (e) {
      // Oculta el modal cuando se recibe la respuesta de la API
      ocultarCargando();
      // Manejo de errores de red u otros
      _mostrarAlerta(
          context,
          Response(
              message: "Error al consumir el API de login", status: "Error"),(){
                // Cierra la alerta cuando se presiona "Aceptar"
                Navigator.of(context).pop();
              },);
      print('Error: $e');
    }
  }

  void ocultarCargando() {
    setState(() {
            _isLoading = false;
          });
  }

  void _mostrarAlerta(BuildContext context, Response? response, Function() onPressed) {
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

  Future<void> apiRegistrarUsuario(BuildContext context) async {
    setState(() {
      _isLoading = true;
    });

    final url = Uri.parse('http://localhost:8080/api/usuarios/crear');
    // Archivo que deseas enviar
    final file = http.MultipartFile.fromBytes(
      'foto', // Nombre del campo en la solicitud
      _selectedFile!.bytes!, 
     filename: _selectedFile!.name, // Ruta del archivo en el dispositivo
    );

    // Otros datos de texto que deseas enviar
  var idRoles = 0;
  for (var rol in roles) {
  if (selectedRol == rol.nombreRol) {
    idRoles = rol.idRol;  // Almacena el idRol si es el rol seleccionado
    break;
  }
}
    final Map<String, String> body = {
      'nombre': nameCtrl.value.text,
      'documento': documentCtrl.value.text,
      'email': emailCtrl.value.text,
      'telefono': mobileCtrl.value.text,
      'idRol': idRoles.toString(),
      // 'idRol':['Administrador', 'Usuario', 'Invitado'],
    };
    // Crear la solicitud multipart
    final request = http.MultipartRequest('POST', url)
      ..fields.addAll(body)
      ..files.add(file);
    try {
      final responseStreamed = await request.send();
      // Espera a que la respuesta esté completa y obtén el cuerpo como String
      final response = await http.Response.fromStream(responseStreamed);
      // Oculta el modal cuando se recibe la respuesta de la API
      ocultarCargando();

      if (response.statusCode == 200) {
         //Qué vas hacer cuando se cree el usuario de forma exitosa?
       var responseExito = Response.fromJson(jsonDecode(response.body));
         _mostrarAlerta(context, responseExito,(){
                // Cierra la alerta cuando se presiona "Aceptar"
                Navigator.of(context).pop();
                Navigator.push(
         context, MaterialPageRoute(builder: (context) => const Inicio())
       );
              },);
 

      } else {
         var responseError = Response.fromJson(jsonDecode(response.body));
        _mostrarAlerta(context, responseError,(){
                // Cierra la alerta cuando se presiona "Aceptar"
                Navigator.of(context).pop();
                });
      }
    } catch (e) {
      // Oculta el modal cuando se recibe la respuesta de la API
      ocultarCargando();
      // Manejo de errores de red u otros
    }
  }
}
