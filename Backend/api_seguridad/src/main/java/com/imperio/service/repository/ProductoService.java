package com.imperio.service.repository;

import com.imperio.service.model.dto.producto.ProductoResponse;
import com.imperio.service.model.entity.ExistenciasEntity;
import com.imperio.service.model.entity.ProductoEntity;
import com.imperio.service.model.entity.RolEntity;
import com.imperio.service.model.entity.UsuariosEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {
    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ExistenciasRepository existenciasRepository;

    public ProductoEntity crearProducto(ProductoEntity producto){
        return  productoRepository.save(producto);

    }

    public List<ProductoEntity> obtenerProductoDuplicado(String nombre, String referencia){
        return  productoRepository.findByNombreProductoAndReferenciaProducto(nombre, referencia);

    }

    public List<ProductoEntity> obtenerProductos(){
        return productoRepository.findAll();
    }

    public  List<ProductoResponse> obtenerProductosCantidades(){
        return productoRepository.obtenerProductosConExistencias();
    }

    public void eliminarProductos(int idProducto){
      productoRepository.deleteById(idProducto);
    }
}
