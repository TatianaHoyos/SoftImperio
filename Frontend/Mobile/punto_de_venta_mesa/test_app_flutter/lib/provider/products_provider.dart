
import 'package:flutter/material.dart';

import '../models/product.dart';
import '../models/utils/product_list_mock.dart';

class ProductProvider with ChangeNotifier {
  // Instancia de ProductListMock, reemplazar por servicio funcional
  final ProductListMock _productListMock = ProductListMock();

  // Getter para la lista de productos
  List<Product> get products => _productListMock.getProducts();

  // Agregar un producto
  void addProduct(Product product) {
    _productListMock.addProduct(product);
    notifyListeners();
  }

  // Obtener productos por categoría
  List<Product> getProductsByCategory(int category) {
    return _productListMock.getProductsByCategory(category);
  }

  List<Product> getProducts() {
    return _productListMock.getProducts();
  }

  // Actualizar la cantidad de un producto
  void updateProductQuantity(Product product, int newQuantity) {
    final productIndex = _productListMock.listMocked.indexOf(product);
    if (productIndex != -1) {
      _productListMock.listMocked[productIndex].quantity = newQuantity;
      notifyListeners();
    }
  }
}
