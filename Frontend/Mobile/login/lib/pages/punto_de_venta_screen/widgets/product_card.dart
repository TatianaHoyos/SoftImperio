import 'package:flutter/material.dart';
import 'package:login/infraestructura/models/producto_seleccionado.dart';
import 'package:login/infraestructura/models/productos.dart';
import 'package:login/infraestructura/models/response.dart';
import 'package:login/infraestructura/provider/cart_provider.dart';
import 'package:login/util/format_currency.dart';
import 'package:provider/provider.dart';
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
        widget.product.referencias[0].idProducto.toString(); // Set initial value
  }

  @override
  void didUpdateWidget(covariant ProductCard oldWidget) {
    super.didUpdateWidget(oldWidget);

    // Detectar cambios en las propiedades del widget y actualizar _selectedReferenceItem
    if (widget.product != oldWidget.product) {
      _selectedReferenceItem = widget.product.referencias[0].idProducto.toString();
    }
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
                      Text(obtenerPrecioProductos(widget.product)),                     
                      Text(" - "),
                       Text('${obtenerCantidadProductos(widget.product)} Und')
                    ],
                  ),
                  const SizedBox(height: 4.0),
                  // Content volume & category (optional)
                  if (widget.product.referencias.isNotEmpty)
                    Row(
                      children: [
                        DropdownButton<String>(
                           style: TextStyle(color: Colors.white), // Estilo del texto seleccionado
                          underline: Container(
                            height: 2,
                            color: Colors.black, // Color del subrayado
                          ),
                          value:
                              _selectedReferenceItem, // Use state variable for value
                          items: widget.product.referencias.map((item) {
                            return DropdownMenuItem(
                              value: item.idProducto.toString(),
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
                /*var referencia = widget.product.referencias.firstWhere(
                      (r) => r.idProducto.toString() == _selectedReferenceItem);*/
                 var productoExistente = Provider.of<CartProvider>(context,listen: false).products.any(
                  (element) => element.idProducto == int.parse(_selectedReferenceItem));

                if (!productoExistente) {
                    var productoSeleccionado = ProductoSeleccionado(cantidad: 0, 
                idProducto: int.parse(_selectedReferenceItem),
                imageUrl: hostFoto+ widget.product.foto,
                name: widget.product.nombreProducto,
                price: obtenerPrecioProductos(widget.product));
                Provider.of<CartProvider>(context,listen: false).addProduct(productoSeleccionado);
                }else{
                   _mostrarAlerta(
          context,
          Response(
              message: "Producto ya seleccionado", status: "Error"));
                }
                
              },
            ),
          ],
        ),
      ),
    );
  }

  String obtenerCantidadProductos(Producto producto) {
    var referencia = producto.referencias.firstWhere(
      (r) => r.idProducto.toString() == _selectedReferenceItem);

      return referencia.existencia.cantidad.toString();
  }

  String obtenerPrecioProductos(Producto producto) {
      var referencia = producto.referencias.firstWhere(
      (r) => r.idProducto.toString() == _selectedReferenceItem);

      return FormatCurrency.formatearMoneda(referencia.precio);
  }

  void _mostrarAlerta(BuildContext context, Response? response) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(response!.status),
          content: Text(response.message),
          actions: [
            ElevatedButton(
              onPressed: () {
                // Cierra la alerta cuando se presiona "Aceptar"
                Navigator.of(context).pop();
              },
              child: Text('Aceptar'),
            ),
          ],
        );
      },
    );
  }
}
