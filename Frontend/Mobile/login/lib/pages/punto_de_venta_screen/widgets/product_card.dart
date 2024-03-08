import 'package:flutter/material.dart';
import 'package:login/infraestructura/models/productos.dart';
//import 'package:login/provider/cart_provider.dart';

class ProductCard extends StatefulWidget {
  final Producto product;

  const ProductCard({Key? key, required this.product}) : super(key: key);

  @override
  State<ProductCard> createState() => _ProductCardState();
}

class _ProductCardState extends State<ProductCard> {
  String _selectedReferenceItem = ''; // Declare state variable
  String hostFoto = "http://192.168.20.31:8080/";

  @override
  void initState() {
    super.initState();
    _selectedReferenceItem =
        widget.product.referencias[0].nombreReferencia; // Set initial value
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.white.withOpacity(0.3),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Row(
          children: [
            // Image
            Image.network(
              hostFoto + widget.product.foto,
              width: 100,
              height: 100,
              fit: BoxFit.cover, // Ajusta según sea necesario
              errorBuilder:
                  (BuildContext context, Object error, StackTrace? stackTrace) {
                // En caso de error al cargar la imagen, mostrar una imagen por defecto
                return Image.asset(
                  'assets/images/logo.png', // Ruta de la imagen por defecto en tu proyecto
                  width: 100,
                  height: 100,
                  fit: BoxFit.cover, // Ajusta según sea necesario
                );
              },
            ),
            const SizedBox(width: 16.0),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Name
                  Text(
                    widget.product.nombreProducto,
                    style: const TextStyle(fontSize: 16.0, color: Colors.white),
                  ),
                  const SizedBox(height: 4.0),
                  // Units & price
                  Row(
                    children: [
                      Text('${obtenerCantidadProductos(widget.product)} units'),
                      const SizedBox(width: 8.0),
                      Text('COP ${obtenerPrecioProductos(widget.product)}'),
                    ],
                  ),
                  const SizedBox(height: 4.0),
                  // Content volume & category (optional)
                  if (widget.product.referencias.isNotEmpty)
                    Row(
                      children: [
                        DropdownButton<String>(
                          value:
                              _selectedReferenceItem, // Use state variable for value
                          items: widget.product.referencias.map((item) {
                            return DropdownMenuItem(
                              value: item.nombreReferencia,
                              child: Text(item.nombreReferencia),
                            );
                          }).toList(),
                          onChanged: (value) {
                            setState(() {
                              _selectedReferenceItem =
                                  value!; //No puede ser null
                            });
                          },
                        ),
                        // const SizedBox(width: 8.0),
                        // Text('Category: ??'),
                      ],
                    ),
                ],
              ),
            ),
            IconButton(
              icon: Icon(Icons.add),
              color: Color(0xFFAE9243),
              onPressed: () {
                // Lógica para agregar al carrito y notificar al usuario
                //Provider.of<CartProvider>(context,listen: false).addProduct(widget.product);
                print("se agrego producto a pedido");
                //int total = Provider.of<CartProvider>(context, listen: false).products.length;
                print("productos en mi pedido ::::pendiente");
              },
            ),
          ],
        ),
      ),
    );
  }

  String obtenerCantidadProductos(Producto producto) {
    //widget.product.units
    return "3";
  }

  String obtenerPrecioProductos(Producto producto) {
    //widget.product.price.toStringAsFixed(2)
    return "21";
  }
}
