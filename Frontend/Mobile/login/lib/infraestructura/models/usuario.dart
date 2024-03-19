// To parse this JSON data, do
//
//     final usuario = usuarioFromJson(jsonString);

import 'dart:convert';

Usuario usuarioFromJson(String str) => Usuario.fromJson(json.decode(str));

String usuarioToJson(Usuario data) => json.encode(data.toJson());

class Usuario {
    final String nombre;
    final String documento;
    final String foto;
    final Rol rol;
    final Authoritation authoritation;

    Usuario({
        required this.nombre,
        required this.documento,
        required this.foto,
        required this.rol,
        required this.authoritation,
    });

    factory Usuario.fromJson(Map<String, dynamic> json) => Usuario(
        nombre: json["nombre"],
        documento: json["documento"],
        foto: json["foto"],
        rol: Rol.fromJson(json["rol"]),
        authoritation: Authoritation.fromJson(json["authoritation"]),
    );

    Map<String, dynamic> toJson() => {
        "nombre": nombre,
        "documento": documento,
        "foto": foto,
        "rol": rol.toJson(),
        "authoritation": authoritation.toJson(),
    };
}

class Authoritation {
   String accessToken;
   String tokenType;
   String refreshToken;

    Authoritation({
        required this.accessToken,
        required this.tokenType,
        required this.refreshToken,
    });

    factory Authoritation.fromJson(Map<String, dynamic> json) => Authoritation(
        accessToken: json["accessToken"],
        tokenType: json["tokenType"],
        refreshToken: json["refreshToken"],
    );

    Map<String, dynamic> toJson() => {
        "accessToken": accessToken,
        "tokenType": tokenType,
        "refreshToken": refreshToken,
    };
}

class Rol {
    final int idRol;
    final String nombreRol;
    final String estado;
    final List<Permiso> permisos;

    Rol({
        required this.idRol,
        required this.nombreRol,
        required this.estado,
        required this.permisos,
    });

    factory Rol.fromJson(Map<String, dynamic> json) => Rol(
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
    final Acciones acciones;
    final Modulo modulo;

    Permiso({
        required this.idPermisos,
        required this.acciones,
        required this.modulo,
    });

    factory Permiso.fromJson(Map<String, dynamic> json) => Permiso(
        idPermisos: json["idPermisos"],
        acciones: Acciones.fromJson(json["acciones"]),
        modulo: Modulo.fromJson(json["modulo"]),
    );

    Map<String, dynamic> toJson() => {
        "idPermisos": idPermisos,
        "acciones": acciones.toJson(),
        "modulo": modulo.toJson(),
    };
}

class Acciones {
    final int idAcciones;
    final Nombre nombre;

    Acciones({
        required this.idAcciones,
        required this.nombre,
    });

    factory Acciones.fromJson(Map<String, dynamic> json) => Acciones(
        idAcciones: json["idAcciones"],
        nombre: nombreValues.map[json["nombre"]]!,
    );

    Map<String, dynamic> toJson() => {
        "idAcciones": idAcciones,
        "nombre": nombreValues.reverse[nombre],
    };
}

enum Nombre {
    CONSULTAR,
    CREAR,
    EDITAR,
    ELIMINAR
}

final nombreValues = EnumValues({
    "Consultar": Nombre.CONSULTAR,
    "Crear": Nombre.CREAR,
    "Editar": Nombre.EDITAR,
    "Eliminar": Nombre.ELIMINAR
});

class Modulo {
    final int idModulo;
    final String nombre;

    Modulo({
        required this.idModulo,
        required this.nombre,
    });

    factory Modulo.fromJson(Map<String, dynamic> json) => Modulo(
        idModulo: json["idModulo"],
        nombre: json["nombre"],
    );

    Map<String, dynamic> toJson() => {
        "idModulo": idModulo,
        "nombre": nombre,
    };
}

class EnumValues<T> {
    Map<String, T> map;
    late Map<T, String> reverseMap;

    EnumValues(this.map);

    Map<T, String> get reverse {
        reverseMap = map.map((k, v) => MapEntry(v, k));
        return reverseMap;
    }
}
