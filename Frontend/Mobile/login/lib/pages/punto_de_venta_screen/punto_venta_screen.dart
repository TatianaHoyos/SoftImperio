import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:login/components/loading.dart';
import 'package:login/infraestructura/models/productos.dart';
/*import 'package:provider/provider.dart';
import 'package:login/models/product.dart';
import 'package:login/provider/cart_provider.dart';
import 'package:login/provider/products_provider.dart';*/
import 'package:login/pages/punto_de_venta_screen/widgets/product_card.dart';
import 'package:login/util/gateway.dart';
import '../../infraestructura/models/response.dart';
import '../../infraestructura/models/categorias.dart';

class SellingPointScreen extends StatefulWidget {
  @override
  _MySellingPointPageState createState() => _MySellingPointPageState();
}

class _MySellingPointPageState extends State<SellingPointScreen>
    with SingleTickerProviderStateMixin {
  bool _isLoading = true;
  List<String> _categorias = [];
  List<Productos> _productos = [];

  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    consumirApis();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        color: Color(0xFF1E1D1D),
        child: _isLoading ? mostrarCargando() : crearNestedScrollView()
        );
  }

  NestedScrollView crearNestedScrollView() {
    return NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) => [
          SliverAppBar(title: const Text("Punto de Venta",
                style: TextStyle(fontWeight: FontWeight.bold)),
            expandedHeight: 140.0,
            floating: true,
            pinned: true,
            bottom: construirTabBar(),
          ),
        ],
        body: crearBody(),
      );
  }

  Stack crearBody() {
    return Stack(
      children: [
        crearListaProductos(),
        crearBotonFlotanteCarrito(),
      ],
    );
  }

  Positioned crearListaProductos() {
    return Positioned(
      top: 0.0,
      left: 0.0,
      right: 0.0,
      bottom: 0.0,
      child: ListView.builder(
        itemCount: _productos.length,
        itemBuilder: (context, index) {
          Productos product = _productos[index]; // Get the current product

          //custom widget to display each product
          //TODO: acá hay que pasar el producto dependiendo de la categoria
          return ProductCard(
              product: product.productos.first); // Pass the product to the widget
        },
      ),
    );
  }

  Positioned crearBotonFlotanteCarrito() {
    return Positioned(
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
                  "",
                  //Provider.of<CartProvider>(context, listen: true).products.length.toString(), // Reemplaza '2' con la cantidad de elementos
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
    );
  }

  Widget mostrarCargando() {
    return const Loading();

    /*return const AlertDialog(
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          CircularProgressIndicator(),
          SizedBox(height: 16.0),
          Text('Cargando...'),
        ],
      ),
    );*/
  }

  TabBar construirTabBar() {
    return TabBar(
      indicatorColor: Color(0xFFAE9243),
      controller: _tabController,
      labelColor: Color(0xFFAE9243),
      isScrollable: true,
      padding: EdgeInsets.zero,
      indicatorPadding: EdgeInsets.only(left: 0.0),
      tabs: _categorias.map((title) => _buildTab(title)).toList(),
    );
  }

  Widget _buildTab(String title) {
    return Tab(text: title);
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

  Future<void> consumirApis() async {
    setState(() {
      _isLoading = true;
    });

    bool exitoCategoria = await consumirApiCategorias();
    bool exitoProductos = await consumirApiProductos();

    if (exitoCategoria && exitoProductos) {
      setState(() {
         _isLoading = false;
        });
    } else {
      final response = Response(
          message: "Ocurrio un error general", status: "Error");
      mostrarError("e", response);
    }
  }

Future<bool> consumirApiProductos() async {
    final gateway = Gateway();
    try {
      final headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      final response = await gateway.makeRequest(
          endpoint: "/edge-service/v1/service/productos/consultar/agrupados",
          method: 'GET',
          headers: headers);
      if (response.statusCode == 200) {
        setState(() {
          _productos = productosFromJson(response.body);
         // _isLoading = false;
        });
        return true;
      } else {
        return false;
      }
    } catch (e) {
      final response = Response(
          message: "Error al consumir el api de Categorias", status: "Error");
      mostrarError(e, response);
      return false;
    }
  }


  Future<bool> consumirApiCategorias() async {
    final gateway = Gateway();
    try {
      final headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      final response = await gateway.makeRequest(
          endpoint: "/edge-service/v1/service/categorias/consultar",
          method: 'GET',
          headers: headers);
      if (response.statusCode == 200) {
        setState(() {
          final categoria = categoriaFromJson(response.body);
          _categorias = categoria.map((c) => c.nombreCategoria).toList();
          _tabController =
              TabController(length: _categorias.length, vsync: this);
          //_isLoading = false;
        });
        return true;
      } else {
        return false;
      }
    } catch (e) {
      final response = Response(
          message: "Error al consumir el api de Categorias", status: "Error");
      mostrarError(e, response);
      return false;
    }
  }

  void mostrarError(e, response) {
    setState(() {
      _isLoading = false;
    });
    // Manejo de errores de red u otros
    _mostrarAlerta(context, response);
    print('Error: $e');
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