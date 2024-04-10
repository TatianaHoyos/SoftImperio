package com.imperio.service.repository;

import com.imperio.service.model.entity.ComprasEntity;
import com.imperio.service.model.entity.VentaEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VentaService {
    @Autowired
    private VentaRepository ventaRepository;

    public List<VentaEntity> obtenerVentas(){
        return ventaRepository.findAll();
    }
}
