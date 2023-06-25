package com.imperio.service.repository;


import com.imperio.service.model.entity.UsuariosEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuariosService {
    @Autowired
    private UsuariosRepository usuariosRepository;

    public UsuariosEntity crearUsuario(UsuariosEntity usuario){return  usuariosRepository.save(usuario);
    }

    public List<UsuariosEntity> obtenerUsuarios(){
        return usuariosRepository.findAll();
    }

    public void eliminarUsuario(int IdUsuarios){
        usuariosRepository.deleteById(IdUsuarios);
    }
}