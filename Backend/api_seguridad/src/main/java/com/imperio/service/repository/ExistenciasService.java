package com.imperio.service.repository;

import com.imperio.service.model.entity.ExistenciasEntity;
import com.imperio.service.model.entity.ProductoEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ExistenciasService {
    @Autowired
    private ExistenciasRepository existenciasRepository;
    @Autowired
    private ProductoRepository productoRepository;

    public ExistenciasEntity crearExistencia(ExistenciasEntity existencia){
        return  existenciasRepository.save(existencia);
    }

    public ExistenciasEntity encontrarExistenciaPorProducto(ProductoEntity producto) {
        return existenciasRepository.findByProductos(producto);
    }


    @Transactional
    public void eliminarExistenciaYProducto(ExistenciasEntity existencias) {
        existenciasRepository.delete(existencias);
        productoRepository.delete(existencias.getProductos());
    }
}
