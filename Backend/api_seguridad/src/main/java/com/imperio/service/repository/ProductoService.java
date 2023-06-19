package com.imperio.service.repository;

import com.imperio.service.model.entity.ProductoEntity;
import com.imperio.service.model.entity.UsuarioEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductoService {
    @Autowired
    private ProductoRepository productoRepository;

    public ProductoEntity crearProducto(ProductoEntity producto){
        return  productoRepository.save(producto);

    }
}