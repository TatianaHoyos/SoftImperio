package com.imperio.service.repository;

import com.imperio.service.model.entity.ProductoEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {
    @Autowired
    private ProductoRepository productoRepository;

    public ProductoEntity obtenerProducto(String nombreProducto){
        return productoRepository.findByNombreProducto(nombreProducto);
    }

    public List<ProductoEntity> obtenerProductoCategoria(int idCategoria){
        return productoRepository.findByIdCategoria(idCategoria);
    }



}


