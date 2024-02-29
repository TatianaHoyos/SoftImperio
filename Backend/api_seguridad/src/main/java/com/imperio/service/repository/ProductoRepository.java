package com.imperio.service.repository;

import com.imperio.service.model.dto.producto.ProductoResponse;
import com.imperio.service.model.entity.ProductoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<ProductoEntity,Integer> {

    //consulta sql SELECT p.* , e.Cantidad FROM productos p INNER JOIN existencia e ON p.IdProductos = e.IdProductos WHERE e.Cantidad IS NOT NULL;

    @Query("SELECT new com.imperio.service.model.dto.producto.ProductoResponse(p.idProductos, p.idCategoria, p.nombreProducto, " +
            "p.fotoProducto, p.precioProducto, p.referenciaProducto, " +
            "new com.imperio.service.model.dto.existencias.ExistenciaDto(e.idExistencias, e.stock, e.cantidad, e.estado)) " +
            "FROM ProductoEntity p LEFT JOIN ExistenciasEntity e ON p.idProductos = e.productos.idProductos")
    List<ProductoResponse> obtenerProductosConExistencias();

    List<ProductoEntity> findByNombreProductoAndReferenciaProducto(String nombreProducto, String referenciaProducto);
}
