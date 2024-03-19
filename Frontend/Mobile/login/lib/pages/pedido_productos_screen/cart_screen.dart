import 'package:flutter/material.dart';
import 'package:login/components/loading.dart';
import 'package:login/infraestructura/models/response.dart';
import 'package:login/util/alterts.dart';
import 'package:login/util/format_currency.dart';
import 'package:login/util/gateway.dart';
import 'package:login/util/unauthorized_exception.dart';
import 'package:provider/provider.dart';
import 'package:login/infraestructura/provider/cart_provider.dart';
import 'package:login/infraestructura/models/producto_seleccionado.dart';

class MyCart extends StatefulWidget {
  const MyCart({Key? key}) : super(key: key);

  @override
  State<MyCart> createState() => _MyCartState();
}

class _MyCartState extends State<MyCart> {
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pedido', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFAE9243))),
      ),
      body: Container(
        child: Column(
          children: [
            Expanded(
              child: Consumer<CartProvider>(
                builder: (context, cartProvider, child) {
                  return SingleChildScrollView(
                    child: Column(
                      children: [
                        Container(
                          color: const Color(0xFFAE9243),
                          width: double.infinity,
                          child: DataTable(
                            dataRowColor: MaterialStateProperty.resolveWith(
                              (Set states) {
                                if (states.contains(MaterialState.selected)) {
                                  return Theme.of(context)
                                      .colorScheme
                                      .primary
                                      .withOpacity(0.08);
                                }
                                return Theme.of(context)
                                    .colorScheme
                                    .secondary
                                    .withOpacity(0.2);
                              },
                            ),
                            columns: [
                              DataColumn(
                                label: Text('Producto', textAlign: TextAlign.center),
                              ),
                              DataColumn(
                                label: Text('Precio', textAlign: TextAlign.center),
                              ),
                              DataColumn(
                                label: Text('Cantidad', textAlign: TextAlign.center),
                              ),
                            ],
                            rows: List.generate(cartProvider.products.length, (index) {
                              final product = cartProvider.products[index];
                              return DataRow(cells: [
                                DataCell(
                                  Row(
                                    children: [
                                      Image.network(
                                        product.imageUrl!, // Reemplaza con la URL real de tu imagen
                                        width: 24,
                                        height: 24,
                                        fit: BoxFit.cover,
                                        loadingBuilder: (BuildContext context, Widget child, ImageChunkEvent? loadingProgress) {
                                          if (loadingProgress == null) {
                                            return child;
                                          } else {
                                            return CircularProgressIndicator();
                                          }
                                        },
                                      ),
                                      Text(product.name! + "\n" + product.referencia!),
                                    ],
                                  ),
                                ),
                                DataCell(
                                  FittedBox(
                                    fit: BoxFit.scaleDown,
                                    child: Text(
                                        FormatCurrency.formatearMoneda(product.price! * product.cantidad!),
                                        textAlign: TextAlign.center,
                                      ),
                                  )
                                ),
                                DataCell(
                                  QuantityEditionCell(product: product),
                                ),
                              ]);
                            }),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            Container(
              color: const Color(0xFFAE9243),
              width: MediaQuery.of(context).size.width,
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 2.5, horizontal: MediaQuery.of(context).size.width / 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      children: [
                        const Text("Total: ", style: TextStyle(fontWeight: FontWeight.bold)),
                        Text(FormatCurrency.formatearMoneda(Provider.of<CartProvider>(context).total)),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Container(
                          margin: const EdgeInsets.only(left: 30),
                          child: ElevatedButton(
                            onPressed: () {
                              consumirApiCrearPedido(Provider.of<CartProvider>(context,listen: false));
                            },
                            style: ButtonStyle(
                              backgroundColor: MaterialStateProperty.all<Color>(Colors.black),
                            ),
                            child: const Text('Enviar a barra'),
                          ),
                        ),
                        const SizedBox(width: 10),
                        ElevatedButton(
                          onPressed: () {
                           Provider.of<CartProvider>(context,listen: false).clearProducts();
        Navigator.of(context).pop();
                          },
                          style: ButtonStyle(
                            backgroundColor: MaterialStateProperty.all<Color>(Colors.black),
                          ),
                          child: const Text('Cancelar'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: _isLoading
          ? Loading() // Muestra el modal si isLoading es verdadero
          : Container(), // Oculta el modal si isLoading es falso
    );
  }

  Future<bool> consumirApiCrearPedido(CartProvider cartProvider) async {
     setState(() {
          _isLoading = true;
        });
    final gateway = Gateway();
    try {
      final headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      List<Map<String, dynamic>> pedido = [];
      for (var producto in cartProvider.products) {
        if (producto.cantidad! > 0) {
          Map<String, dynamic> productoMap = {
            "idProducto": producto.idProducto,
            "cantidad": producto.cantidad,
          };
          pedido.add(productoMap);
        }
      }
      Map<String, dynamic> pedidoTotal = {"pedido": pedido};

      final response = await gateway.makeRequest(
        endpoint: "/edge-service/v1/service/venta/mesa/crear",
        method: 'POST',
        headers: headers,
        body: pedidoTotal,
      );
      setState(() {
          _isLoading = false;
        });
      if (response.statusCode == 200) {
        final responseObject = responseFromJson(response.body);
       Alert.mostrarAlerta(
          context,
          responseObject,
          () {
            cartProvider.clearProducts();
        Navigator.of(context).pop();
        Navigator.of(context).pop();
          },
        );
        return true;
      } else {
          final response = Response(
          message: "Error al consumir el api de crear pedido",
          status: "Error",
        );
        Alert.mostrarAlerta(context, response, () {Navigator.of(context).pop();});
          return false;
        }
    } on UnauthorizedExcepcion catch (e) {
          Alert.mostrarAlerta(
          context,
          Response(
              message: "Su sesión a caducado", status: "Error"), 
              () {Navigator.pushReplacementNamed(context, '/');});
              return false;
    } 
    catch (e) {
      setState(() {
          _isLoading = false;
        });
      final response = Response(
        message: "Error al consumir el api de Categorias",
        status: "Error",
      );
      Alert.mostrarAlerta(context, response, () {Navigator.of(context).pop();});
      return false;
    }
  }

}

class QuantityEditionCell extends StatelessWidget {
  const QuantityEditionCell({
    Key? key,
    required this.product,
  }) : super(key: key);

  final ProductoSeleccionado product;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        GestureDetector(
          onTap: () {
            Provider.of<CartProvider>(context, listen: false).restarProduct(product);
          },
          child: const Icon(Icons.remove),
        ),
        const SizedBox(width: 8),
        Text(product.cantidad.toString()),
        const SizedBox(width: 8),
        GestureDetector(
          onTap: () {
            Provider.of<CartProvider>(context, listen: false).sumarProduct(product);
          },
          child: const Icon(Icons.add),
        ),
        const SizedBox(width: 8),
      ],
    );
  }
}
