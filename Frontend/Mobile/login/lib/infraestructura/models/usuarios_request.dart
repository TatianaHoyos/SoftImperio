// To parse this JSON data, do
//
//     final usuariosRequest = usuariosRequestFromJson(jsonString);

import 'dart:convert';

UsuariosRequest usuariosRequestFromJson(String str) => UsuariosRequest.fromJson(json.decode(str));

String usuariosRequestToJson(UsuariosRequest data) => json.encode(data.toJson());

class UsuariosRequest {
    final int idRol;
    final String nombre;
    final String documento;
    final String email;
    final String telefono;
    final String estado;

    UsuariosRequest({
        required this.idRol,
        required this.nombre,
        required this.documento,
        required this.email,
        required this.telefono,
        required this.estado,
    });

    factory UsuariosRequest.fromJson(Map<String, dynamic> json) => UsuariosRequest(
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
