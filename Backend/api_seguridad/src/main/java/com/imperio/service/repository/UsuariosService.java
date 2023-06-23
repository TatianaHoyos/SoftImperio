package com.imperio.service.repository;

import com.imperio.service.model.entity.RolEntity;
import com.imperio.service.model.entity.UsuariosEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuariosService {
    @Autowired
    private UsuariosRepository usuariosRepository;

    public UsuariosEntity crearUsuario(UsuariosEntity usuario){
        return  UsuariosRepository.save(usuario);
    }

    public List<UsuariosEntity> obtenerUsuarios(){
        return UsuariosRepository.findAll();
    }

    public void eliminarUsuario(int IdUsuarios){
        UsuariosRepository.deleteById(IdUsuarios);
    }
}