
import 'package:flutter/material.dart';

import '../models/product.dart';
import 'package:provider/provider.dart';


class CartProvider with ChangeNotifier {
  List<Product> products = [];
  double total = 0;

  void addProduct(Product product) {
    products.add(product);
    total += product.price * product.quantity;
    notifyListeners();
  }

  void removeProduct(Product product) {
    products.remove(product);
    total -= product.price * product.quantity;
    notifyListeners();
  }

  void updateProduct(Product product, int newQuantity) {
    total -= product.price * product.quantity;
    product.quantity = newQuantity;
    total += product.price * product.quantity;
    notifyListeners();
  }

  double calculateTotalPrice() {
    return total;
  }
}
