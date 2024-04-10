package com.imperio.service.repository;

import com.imperio.service.model.entity.CategoriaEntity;
import com.imperio.service.model.entity.ComprasEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompraService {
    @Autowired
    private CompraRepository compraRepository;

    public List<ComprasEntity> obtenerCompras(){
        return compraRepository.findAll();
    }
}
