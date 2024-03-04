
class Product {
  final String name;
  final int units;
  final double price;
  late int quantity;
  final String imageUrl;
  final double contentMl;
  final int category;
  final List<String> referenceItems;

  Product( {required this.name, required this.units, required this.price, required this.quantity, required  this.imageUrl, required this.contentMl, required this.category,required this.referenceItems });
}
