
import 'package:flutter/material.dart';
import 'package:login/infraestructura/models/producto_seleccionado.dart';

import '../models/productos.dart';
import 'package:provider/provider.dart';


class CartProvider with ChangeNotifier {
  List<ProductoSeleccionado> products = [];
  double total = 0;

  void addProduct(ProductoSeleccionado product) {
    products.add(product);
    //total += product. * product.quantity;
    notifyListeners();
  }

  void removeProduct(ProductoSeleccionado product) {
    products.remove(product);
    //total -= product.price * product.quantity;
    notifyListeners();
  }

  void updateProduct(ProductoSeleccionado product, int newQuantity) {
    //total -= product.price * product.quantity;
    product.cantidad = newQuantity;
    //total += product.price * product.quantity;
    notifyListeners();
  }

  double calculateTotalPrice() {
    return total;
  }
}
