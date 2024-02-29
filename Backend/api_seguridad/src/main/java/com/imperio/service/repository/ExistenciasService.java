package com.imperio.service.repository;

import com.imperio.service.model.entity.ExistenciasEntity;
import com.imperio.service.model.entity.ProductoEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExistenciasService {
    @Autowired
    private ExistenciasRepository existenciasRepository;

    public ExistenciasEntity crearExistencia(ExistenciasEntity existencia){
        return  existenciasRepository.save(existencia);
    }

    public ExistenciasEntity encontrarExistenciaPorProducto(ProductoEntity producto) {
        return existenciasRepository.findByProductos(producto);
    }
}
