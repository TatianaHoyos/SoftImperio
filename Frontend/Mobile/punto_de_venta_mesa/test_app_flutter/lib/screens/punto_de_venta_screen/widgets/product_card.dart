import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:test_app_flutter/models/product.dart';
import 'package:test_app_flutter/provider/cart_provider.dart';

class ProductCard extends StatefulWidget {
  final Product product;

  const ProductCard({Key? key, required this.product}) : super(key: key);

  @override
  State<ProductCard> createState() => _ProductCardState();
}

class _ProductCardState extends State<ProductCard> {
  String _selectedReferenceItem = ''; // Declare state variable

  @override
  void initState() {
    super.initState();
    _selectedReferenceItem = widget.product.referenceItems[0]; // Set initial value
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
              widget.product.imageUrl,
              width: 100,
              height: 100,
              fit: BoxFit.cover, // Adjust as needed
            ),
            const SizedBox(width: 16.0),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Name
                  Text(
                    widget.product.name,
                    style: const TextStyle(fontSize: 16.0,color: Colors.white),
                  ),
                  const SizedBox(height: 4.0),
                  // Units & price
                  Row(
                    children: [
                      Text('${widget.product.units} units'),
                      const SizedBox(width: 8.0),
                      Text('COP ${widget.product.price.toStringAsFixed(2)}'),
                    ],
                  ),
                  const SizedBox(height: 4.0),
                  // Content volume & category (optional)
                  if (widget.product.contentMl != null && widget.product.category != null)

                  Row(
                      children: [
                        //Text('${product.contentMl} ml'),
                        DropdownButton<String>(
                          value: _selectedReferenceItem, // Use state variable for value
                          items: widget.product.referenceItems.map((item) {
                            return DropdownMenuItem(
                              value: item,
                              child: Text(item),
                            );
                          }).toList(),
                          onChanged: (value) {
                            setState(() {
                              print("values es ${value}");
                              _selectedReferenceItem = value!; //No puede ser null
                            });
                          },
                        ),
                        const SizedBox(width: 8.0),
                        Text('Category: ${widget.product.category}'),
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
                Provider.of<CartProvider>(context,listen: false).addProduct(widget.product);
                print("se agrego producto a pedido");
                int total = Provider.of<CartProvider>(context, listen: false).products.length;
                print("productos en mi pedido ${total}");

              },
            ),
          ],
        ),
      ),
    );
  }
}