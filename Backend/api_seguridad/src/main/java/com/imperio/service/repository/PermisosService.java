package com.imperio.service.repository;

import com.imperio.service.model.entity.PermisosEntity;
import com.imperio.service.model.entity.ProductoEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermisosService {
    @Autowired
    private PermisosRepository permisosRepository;

    public List<PermisosEntity> obtenerPermisos(){
        return permisosRepository.findAll();
    }
}
