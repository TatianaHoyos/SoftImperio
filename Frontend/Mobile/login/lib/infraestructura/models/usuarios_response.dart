// To parse this JSON data, do
//
//     final usuariosResponse = usuariosResponseFromJson(jsonString);

import 'dart:convert';

List<UsuariosResponse> usuariosResponseFromJson(String str) => List<UsuariosResponse>.from(json.decode(str).map((x) => UsuariosResponse.fromJson(x)));

String usuariosResponseToJson(List<UsuariosResponse> data) => json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

class UsuariosResponse {
    final int idUsuarios;
    final int idRol;
    final String nombre;
    final String documento;
    final String email;
    final String telefono;
    final String foto;
    final String password;
    final String estado;

    UsuariosResponse({
        required this.idUsuarios,
        required this.idRol,
        required this.nombre,
        required this.documento,
        required this.email,
        required this.telefono,
        required this.foto,
        required this.password,
        required this.estado,
    });

    factory UsuariosResponse.fromJson(Map<String, dynamic> json) => UsuariosResponse(
        idUsuarios: json["idUsuarios"],
        idRol: json["idRol"],
        nombre: json["nombre"],
        documento: json["documento"],
        email: json["email"],
        telefono: json["telefono"],
        foto: json["foto"],
        password: json["password"],
        estado: json["estado"],
    );

    Map<String, dynamic> toJson() => {
        "idUsuarios": idUsuarios,
        "idRol": idRol,
        "nombre": nombre,
        "documento": documento,
        "email": email,
        "telefono": telefono,
        "foto": foto,
        "password": password,
        "estado": estado,
    };
}
