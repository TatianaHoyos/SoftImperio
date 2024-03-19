// To parse this JSON data, do
//
//     final categoria = categoriaFromJson(jsonString);

import 'dart:convert';

List<Categoria> categoriaFromJson(String str) => List<Categoria>.from(json.decode(str).map((x) => Categoria.fromJson(x)));

String categoriaToJson(List<Categoria> data) => json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

class Categoria {
    final int idCategoria;
    final String nombreCategoria;

    Categoria({
        required this.idCategoria,
        required this.nombreCategoria,
    });

    factory Categoria.fromJson(Map<String, dynamic> json) => Categoria(
        idCategoria: json["idCategoria"],
        nombreCategoria: json["nombreCategoria"],
    );

    Map<String, dynamic> toJson() => {
        "idCategoria": idCategoria,
        "nombreCategoria": nombreCategoria,
    };
}
