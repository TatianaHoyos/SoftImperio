
import 'package:flutter/material.dart';
import 'package:login/infraestructura/models/producto_seleccionado.dart';
import 'package:login/util/format_currency.dart';

import '../models/productos.dart';
import 'package:provider/provider.dart';


class CartProvider with ChangeNotifier {
  List<ProductoSeleccionado> products = [];
  num total = 0;

  void addProduct(ProductoSeleccionado product) {
    products.add(product);
    calcularTotal();
    notifyListeners();
  }

  void removeProduct(ProductoSeleccionado product) {
    products.remove(product);
    calcularTotal();
    notifyListeners();
  }

  void sumarProduct(ProductoSeleccionado product) {
    
    product.cantidad = product.cantidad! + 1;
     calcularTotal();
    notifyListeners();
  }

void restarProduct(ProductoSeleccionado product) {
    
    if (product.cantidad! > 0) {
      product.cantidad = product.cantidad! - 1;
      calcularTotal();
    }
    notifyListeners();
  }

  calcularTotal() {
    total = 0;
    for (var producto in products) {
      total += producto.price! * producto.cantidad!;
    }
}
  void clearProducts() {
    products.clear(); // Elimina todos los productos del provider
    total = 0; // También puedes restablecer el total a cero si es necesario
    notifyListeners();
  }
}
