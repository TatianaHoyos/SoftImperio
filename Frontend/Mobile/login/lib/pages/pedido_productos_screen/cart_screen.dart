import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:login/infraestructura/provider/cart_provider.dart';
import 'package:login/infraestructura/models/producto_seleccionado.dart';

class MyCart extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
                title: const Text('Pedido'),
      ),
      body: Container(
                child: Column(
          //crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Access CartProvider directly within build method
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
                            dataRowColor: MaterialStateProperty.resolveWith((Set states) {
                              if (states.contains(MaterialState.selected)) {
                                return Theme.of(context).colorScheme.primary.withOpacity(0.08);
                              }
                              return Theme.of(context).colorScheme.secondary.withOpacity(0.2);
                            }),
                            columns: [
                              DataColumn(label: Text('Producto', textAlign: TextAlign.center)),
                                    DataColumn(label: Text('Precio', textAlign: TextAlign.center)),
                              DataColumn(label: Text('Cantidad', textAlign: TextAlign.center)),
                            //  const DataColumn(label: Text('Total', textAlign: TextAlign.start)),
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
Text(product.name!, ), // Display price here
                                        
                                    ],
                                  ),
                                ),
DataCell(Row(
                                  children: [
                                    Text(product.price!, textAlign: TextAlign.center),
                                  ],
                                )),
                                // Celda con iconos de suma y resta
                                DataCell(
                                  QuantityEditionCell(product: product),
                                ),

                              //  DataCell(Text("\$${(product.price * product.quantity).toStringAsFixed(2)}")),
                              ]);

                            }),
                          ),
                        ),
                        // Calculate total price dynamically based on updated quantities
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
                padding:  EdgeInsets.symmetric(vertical: 2.5, horizontal: MediaQuery.of(context).size.width / 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      children: [
                        const Text("Total: ", style: TextStyle(fontWeight: FontWeight.bold)),
                        Text('\$ ${Provider.of<CartProvider>(context).total}'),
                      ],
                    ),

                    //botones
Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                    Container(
                      margin: EdgeInsets.only(left: 30),
                      child: ElevatedButton(
                        onPressed: (){
                          //Lógica para enviar a barra
                        },
                        style: ButtonStyle(
                            backgroundColor: MaterialStateProperty.all<Color>(Colors.black)
                        ),
                        child: const Text('Enviar a barra'),
                      ),
                    ),
                    const SizedBox(width: 10),//espacio entre botones
                    ElevatedButton(
                      onPressed: (){
                        //Lógica para cancelar
                      },
                      style: ButtonStyle(
                          backgroundColor: MaterialStateProperty.all<Color>(Colors.black)
                      ),
                      child: const Text('Cancelar'),
),
                      ],
                    )
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class QuantityEditionCell extends StatelessWidget {
  const QuantityEditionCell({
    super.key,
    required this.product,
  });

  final ProductoSeleccionado product;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        GestureDetector(
          onTap: () {
            // Lógica para restar la cantidad
            // Puedes agregar tu lógica aquí
          },
          child: const Icon(Icons.remove),
        ),

        // Espacio entre los iconos y la cantidad
        const SizedBox(width: 8),

        Text(product.cantidad.toString()),  // Valor de la cantidad

        // Espacio entre la cantidad y los iconos
        const SizedBox(width: 8),

        GestureDetector(
          onTap: () {
            // Lógica para sumar la cantidad
            // Puedes agregar tu lógica aquí
          },
          child: const Icon(Icons.add),
        ),
        const SizedBox(width: 8),

        // GestureDetector(
          //   onTap: () {
            //     // Lógica para sumar la cantidad
            //     // Puedes agregar tu lógica aquí
          //   },
          //   child: const Icon(Icons.delete, color: Colors.redAccent,),
        // ),
      ],
    );
  }
}
