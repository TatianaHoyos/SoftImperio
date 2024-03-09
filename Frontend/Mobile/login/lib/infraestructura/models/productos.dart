// To parse this JSON data, do
//
//     final productos = productosFromJson(jsonString);

import 'dart:convert';

List<Productos> productosFromJson(String str) => List<Productos>.from(json.decode(str).map((x) => Productos.fromJson(x)));

String productosToJson(List<Productos> data) => json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

class Productos {
    final String idCategoria;
    final List<Producto> productos;

    Productos({
        required this.idCategoria,
        required this.productos,
    });

    factory Productos.fromJson(Map<String, dynamic> json) => Productos(
        idCategoria: json["idCategoria"],
        productos: List<Producto>.from(json["productos"].map((x) => Producto.fromJson(x))),
    );

    Map<String, dynamic> toJson() => {
        "idCategoria": idCategoria,
        "productos": List<dynamic>.from(productos.map((x) => x.toJson())),
    };
}

class Producto {
    final String nombreProducto;
    final String foto;
    final List<Referencia> referencias;

    Producto({
        required this.nombreProducto,
        required this.foto,
        required this.referencias,
    });

    factory Producto.fromJson(Map<String, dynamic> json) => Producto(
        nombreProducto: json["nombreProducto"],
        foto: json["foto"],
        referencias: List<Referencia>.from(json["referencias"].map((x) => Referencia.fromJson(x))),
    );

    Map<String, dynamic> toJson() => {
        "nombreProducto": nombreProducto,
        "foto": foto,
        "referencias": List<dynamic>.from(referencias.map((x) => x.toJson())),
    };
}

class Referencia {
    final int idProducto;
    final String nombreReferencia;
    final num precio;
    final Existencia existencia;

    Referencia({
        required this.idProducto,
        required this.nombreReferencia,
        required this.precio,
        required this.existencia,
    });

    factory Referencia.fromJson(Map<String, dynamic> json) => Referencia(
        idProducto: json["idProducto"],
        nombreReferencia: json["nombreReferencia"],
        precio: json["precio"],
        existencia: Existencia.fromJson(json["existencia"]),
    );

    Map<String, dynamic> toJson() => {
        "idProducto": idProducto,
        "nombreReferencia": nombreReferencia,
        "precio": precio,
        "existencia": existencia.toJson(),
    };
}

class Existencia {
    final int idExistencias;
    final int idProductos;
    final int stock;
    final int cantidad;
    final String estado;

    Existencia({
        required this.idExistencias,
        required this.idProductos,
        required this.stock,
        required this.cantidad,
        required this.estado,
    });

    factory Existencia.fromJson(Map<String, dynamic> json) => Existencia(
        idExistencias: json["idExistencias"],
        idProductos: json["idProductos"],
        stock: json["stock"],
        cantidad: json["cantidad"],
        estado: json["estado"],
    );

    Map<String, dynamic> toJson() => {
        "idExistencias": idExistencias,
        "idProductos": idProductos,
        "stock": stock,
        "cantidad": cantidad,
        "estado": estado,
    };
}
