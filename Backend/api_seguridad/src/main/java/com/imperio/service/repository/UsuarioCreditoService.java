package com.imperio.service.repository;

import com.imperio.service.model.entity.UsuarioCreditoEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioCreditoService {
    @Autowired
    private UsuarioCreditoRepository usuariocreditoRepository;

    public UsuarioCreditoEntity crearUsuarioCredito(UsuarioCreditoEntity usuariocredito){
        return  usuariocreditoRepository.save(usuariocredito);

    }

    public List<UsuarioCreditoEntity> obtenerUsuarioCredito(){
        return usuariocreditoRepository.findAll();
    }

    public void eliminarUsuarioCredito(int IdUsuarioCredito){
        usuariocreditoRepository.deleteById(IdUsuarioCredito);
    }
}
