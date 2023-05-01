package com.imperio.service.repository;

import com.imperio.service.model.entity.ProductoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository  extends JpaRepository<ProductoEntity,Integer> {

    ProductoEntity findByNombreProductoAndReferenciaProducto(String nombreProducto, String referenciaProducto);
    ProductoEntity findByNombreProducto(String nombreProducto);
    List<ProductoEntity> findByIdCategoria(int idCategoria);
    ProductoEntity findByPrecioProducto(float precioProducto);

}
