
import '../product.dart';

class ProductListMock {
  List<Product> listMocked = [
    Product(name: "Cerveza Club Colombia",
        units: 100,
        price: 4500,
        quantity: 1,
        imageUrl: "https://thefoodtech.com/wp-content/uploads/2023/07/cerveza-artesanal-828x548.jpg",
        contentMl: 330,
        category: 1,
        referenceItems: ['330','500','1000','2000']
    ),
    Product(name: "Cerveza Nectar",
        units: 100,
        price: 3000,
        quantity: 1,
        imageUrl: "https://s3.amazonaws.com/takami.co/thumbnails/productimage/24225c9ee8f64d31950a0f7a9964e879/dzjkwm22hp6hkzsx69nfp2_1280_800.jpg",
        contentMl: 350,
        category: 1,
        referenceItems: ['330','500','1000','2000']
    ),
    Product(name: "Cerveza Aguila",
        units: 50,
        price: 5000,
        quantity: 1,
        imageUrl: "https://dev.misterwings.com/wp-content/uploads/2020/05/Bebidas_0014_AGUILALIGHT330.jpg",
        contentMl: 750,
        category: 2,
        referenceItems: ['330','500','1000','2000']
    ),
    Product(name: "Cerveza Andina",
        units: 50,
        price: 5000,
        quantity: 1,
        imageUrl: "https://lacostilladejuan.com/wp-content/uploads/2020/06/Andina-1.jpg",
        contentMl: 750,
        category: 2,
        referenceItems: ['330','500','1000','2000']
    ),
    Product(name: "Cerveza Aguila",
        units: 50,
        price: 5000,
        quantity: 1,
        imageUrl: "https://dev.misterwings.com/wp-content/uploads/2020/05/Bebidas_0014_AGUILALIGHT330.jpg",
        contentMl: 750,
        category: 2,
        referenceItems: ['330','500','1000','2000']
    ),
    Product(name: "Cerveza Andina",
        units: 50,
        price: 5000,
        quantity: 1,
        imageUrl: "https://lacostilladejuan.com/wp-content/uploads/2020/06/Andina-1.jpg",
        contentMl: 750,
        category: 2,
        referenceItems: ['330','500','1000','2000']
    ),
    // ... other products
  ];


  void addProduct(Product product) {
    listMocked.add(product);
  }


  List<Product> getProducts(){
    return listMocked;
  }

  List<Product> getProductsByCategory(int category){
    //TODO: filtrar por categoria
    return listMocked;
  }
}