package com.imperio.service.repository;

import com.imperio.service.model.entity.UsuarioCreditoEntity;
import com.imperio.service.model.entity.RolEntity;
import com.imperio.service.model.entity.UsuarioEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioCreditoService {
    @Autowired
    private UsuarioCreditoRepository usuariocreditoRepository;

    public UsuarioCreditoEntity crearUsuarioCredito(UsuarioCreditoEntity usuariocredito){
        return  UsuarioCreditoRepository.save(usuariocredito);

    }

    public List<UsuarioCreditoEntity> obtenerProductos(){
        return UsuarioCreditoRepository.findAll();
    }

    public void eliminarUsuarioCredito(int IdUsuarioCredito){
        UsuarioCreditoRepository.deleteById(IdUsuarioCredito);
    }
}
