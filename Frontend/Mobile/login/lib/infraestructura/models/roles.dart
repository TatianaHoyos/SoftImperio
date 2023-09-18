// To parse this JSON data, do
//
//     final roles = rolesFromJson(jsonString);

import 'dart:convert';

List<Roles> rolesFromJson(String str) => List<Roles>.from(json.decode(str).map((x) => Roles.fromJson(x)));

String rolesToJson(List<Roles> data) => json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

class Roles {
    final int idRol;
    final String nombreRol;
    final String estado;
    final List<Permiso> permisos;

    Roles({
        required this.idRol,
        required this.nombreRol,
        required this.estado,
        required this.permisos,
    });

    factory Roles.fromJson(Map<String, dynamic> json) => Roles(
        idRol: json["idRol"],
        nombreRol: json["nombreRol"],
        estado: json["estado"],
        permisos: List<Permiso>.from(json["permisos"].map((x) => Permiso.fromJson(x))),
    );

    Map<String, dynamic> toJson() => {
        "idRol": idRol,
        "nombreRol": nombreRol,
        "estado": estado,
        "permisos": List<dynamic>.from(permisos.map((x) => x.toJson())),
    };
}

class Permiso {
    final int idPermisos;
    final String nombrePermiso;
    final String modulo;

    Permiso({
        required this.idPermisos,
        required this.nombrePermiso,
        required this.modulo,
    });

    factory Permiso.fromJson(Map<String, dynamic> json) => Permiso(
        idPermisos: json["idPermisos"],
        nombrePermiso: json["nombrePermiso"],
        modulo: json["modulo"],
    );

    Map<String, dynamic> toJson() => {
        "idPermisos": idPermisos,
        "nombrePermiso": nombrePermiso,
        "modulo": modulo,
    };
}
