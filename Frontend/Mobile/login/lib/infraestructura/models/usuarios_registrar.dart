// To parse this JSON data, do
//
//     final usuariosRegistrar = usuariosRegistrarFromJson(jsonString);

import 'dart:convert';

UsuariosRegistrar usuariosRegistrarFromJson(String str) => UsuariosRegistrar.fromJson(json.decode(str));

String usuariosRegistrarToJson(UsuariosRegistrar data) => json.encode(data.toJson());

class UsuariosRegistrar {
    final int idRol;
    final String nombre;
    final String documento;
    final String email;
    final String telefono;
    final String estado;

    UsuariosRegistrar({
        required this.idRol,
        required this.nombre,
        required this.documento,
        required this.email,
        required this.telefono,
        required this.estado,
    });

    factory UsuariosRegistrar.fromJson(Map<String, dynamic> json) => UsuariosRegistrar(
        idRol: json["idRol"],
        nombre: json["nombre"],
        documento: json["documento"],
        email: json["email"],
        telefono: json["telefono"],
        estado: json["estado"],
    );

    Map<String, dynamic> toJson() => {
        "idRol": idRol,
        "nombre": nombre,
        "documento": documento,
        "email": email,
        "telefono": telefono,
        "estado": estado,
    };
}
