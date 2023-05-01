package com.imperio.service.repository;

import com.imperio.service.model.entity.CategoriaEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class CategoriaService {
    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<CategoriaEntity> obtenerAllCategoria(){
        return categoriaRepository.findAll();
    }
}
