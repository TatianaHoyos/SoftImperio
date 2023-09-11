// To parse this JSON data, do
//
//     final usuarios = temperaturesFromJson(jsonString);

import 'dart:convert';

Usuario usuariosFromJson(String str) => Usuario.fromJson(json.decode(str));

String usuariosToJson(Usuario data) => json.encode(data.toJson());

class Usuario {
    final String nombre;
    final String documento;
    final String foto;
    final int rol;

    Usuario({
        required this.nombre,
        required this.documento,
        required this.foto,
        required this.rol,
    });

    factory Usuario.fromJson(Map<String, dynamic> json) => Usuario(
        nombre: json["nombre"],
        documento: json["documento"],
        foto: json["foto"],
        rol: json["rol"],
    );

    Map<String, dynamic> toJson() => {
        "nombre": nombre,
        "documento": documento,
        "foto": foto,
        "rol": rol,
    };
}
