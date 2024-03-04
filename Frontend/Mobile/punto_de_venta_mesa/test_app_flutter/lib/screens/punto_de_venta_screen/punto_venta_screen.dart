import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import 'package:test_app_flutter/models/product.dart';
import 'package:test_app_flutter/provider/cart_provider.dart';
import 'package:test_app_flutter/provider/products_provider.dart';
import 'package:test_app_flutter/screens/punto_de_venta_screen/widgets/product_card.dart';

class SellingPointScreen extends StatefulWidget {
  @override
  _MySellingPointPageState createState() => _MySellingPointPageState();
}

class _MySellingPointPageState extends State<SellingPointScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final Map<int, String> _tabTitles = { // Map with tab titles
    0: 'Cervezas',
    1: 'Wiskis',
    2: 'Cocteles',
    3: 'Otros',
  };

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    List<Product> productos = Provider.of<ProductProvider>(context).getProducts();

    return Container(
      color: Color(0xFF1E1D1D),
      child: NestedScrollView(

        headerSliverBuilder: (context, innerBoxIsScrolled) =>
        [
          SliverAppBar(
            backgroundColor: Color(0xFF090909),
            title: Text(
                "Punto de Venta", style: TextStyle(fontWeight: FontWeight.bold)),
            expandedHeight: 140.0,
            floating: true,
            pinned: true,
            bottom: TabBar(
              indicatorColor: Color(0xFFAE9243),
              controller: _tabController,
              labelColor: Color(0xFFAE9243),
              isScrollable: true,
              padding: EdgeInsets.zero,
              indicatorPadding: EdgeInsets.only(left: 0.0),
              tabs: [
                Tab(icon: Icon(Icons.liquor_rounded), text: 'Todos'),
                Tab(icon: Icon(FontAwesomeIcons.beer), text: 'Cervezas'),
                Tab(icon: Icon(FontAwesomeIcons.whiskeyGlass), text: 'Wiskis'),
                Tab(icon: Icon(Icons.local_drink), text: 'Otros'),
              ],
            ),
          ),
        ],
        body:Stack(
          children: [
            Positioned(
              top: 0.0,
              left: 0.0,
              right: 0.0,
              bottom: 0.0,
              child: ListView.builder(
                itemCount: productos.length,
                itemBuilder: (context, index) {
                  Product product = productos[index]; // Get the current product

                  //custom widget to display each product
                  return ProductCard(product: product); // Pass the product to the widget
                },
              ),
            ),
            Positioned(
              bottom: 16.0,
              right: 16.0,
              child: Stack(
                children: [
                  getCarritoButton(),
                  Positioned(
                    top: -8.0,
                    right: -10.0,
                    child: Container(
                      width: 28.0,
                      height: 28.0,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.red,
                      ),
                      child: Center(
                        child: Text(
                          Provider.of<CartProvider>(context, listen: true).products.length.toString(), // Reemplaza '2' con la cantidad de elementos
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

          ],
        ),

      )

        //  ColumnProductList(tabTitles: _tabTitles, tabController: _tabController, productos: productos),

    );
  }

  Widget getCarritoButton() {
    return FloatingActionButton(
      backgroundColor: Color(0xFFAE9243),
      onPressed: () {
        // Navega a la otra pantalla
        Navigator.pushNamed(context, '/screen_carrito');
      },
      child: Icon(Icons.shopping_cart),
    );
  }
}

class ColumnProductList extends StatelessWidget {
  const ColumnProductList({
    super.key,
    required Map<int, String> tabTitles,
    required TabController tabController,
    required this.productos,
  }) : _tabTitles = tabTitles, _tabController = tabController;

  final Map<int, String> _tabTitles;
  final TabController _tabController;
  final List<Product> productos;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        Text(
          _tabTitles[_tabController.index]!, // Display selected tab title
          style: TextStyle(color: Colors.red),
        ),
        SizedBox(height: 10,),
        Text(
          productos.length.toString(), // Display selected tab title
          style: TextStyle(color: Colors.red),
        ),
        SizedBox(height: 20,),

        ListView.builder(
              itemCount: productos.length,
              itemBuilder: (context, index) {
                // Access the current product data using the index
                Product product = productos[index];

                // Build the widget for each list item
                return ListTile(
                  key: ValueKey(product.name), // Unique key for each item
                  title: Text(product.name),
                  subtitle: Text(product.imageUrl),
                  leading: Image.network(product.imageUrl),
                );
              },
         ),

      ],
    );
  }
}
