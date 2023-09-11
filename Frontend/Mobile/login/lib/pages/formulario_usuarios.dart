import 'package:flutter/material.dart';
import 'package:login/components/my_button.dart';
import 'package:login/components/my_dropdown.dart';
import 'package:login/components/my_text_field.dart';
import 'package:login/pages/inicio_page.dart';
import 'package:file_picker/file_picker.dart';

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


  bool enableButton = false;

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
    if (_selectedFile == null){
                    return "Debe seleccionar una foto";
                  }
    return null;
  }

  @override
  void initState() {
    super.initState();
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
                errorText:  validateName,
                secureText: false,
                prefixIcon: Icon(Icons.person),
              ),
              const SizedBox(height: 10),
              MyTextField(
                controller: documentCtrl,
                hintText: 'Documento',
                errorText:  validateDocumento ,
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
                items: const ['Administrador', 'Usuario', 'Invitado'],
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
            //  ElevatedButton(
            //     onPressed: _pickFile, // Llama al método para seleccionar archivo
            //     child: Text('Seleccionar Archivo'),
            //   ),
            //   if (_selectedFile != null)
            //     Text('Archivo seleccionado: ${_selectedFile!.name}'),

              const SizedBox(height: 10),
              MyButton(
                text: 'Registrar',
                onPressed: enableButton
                    ? () {
                        onclickLogin(context);
                      }
                    : null,
              ),
            ])));
  }

  void validateEmptyTextField() {
    setState(() {
      enableButton = (validateName == null &&
        validateDocumento == null &&
        validateEmail == null &&
        validateTelefono == null &&
        selectedRol!=null &&
         _selectedFile != null);
    });
  }

  void onclickLogin(BuildContext context) {
    
    Navigator.push(
          context, MaterialPageRoute(builder: (context) => const Inicio()));
  }

  void _pickFile() async {
  FilePickerResult? result = await FilePicker.platform.pickFiles();

  if (result != null) {
    setState(() {
      _selectedFile = result.files.first;
      if (_selectedFile != null){
        fotoCtrl.text = _selectedFile!.name;
        validateFoto;
      }
    });
  }
}
}