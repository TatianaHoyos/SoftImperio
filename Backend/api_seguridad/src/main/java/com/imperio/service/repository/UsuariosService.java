package com.imperio.service.repository;


import com.imperio.service.model.entity.UsuariosEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuariosService {
    @Autowired
    private UsuariosRepository usuariosRepository;

    public UsuariosEntity crearUsuario(UsuariosEntity usuario){return  usuariosRepository.save(usuario);
    }

    public List<UsuariosEntity> obtenerUsuarios(){
        return usuariosRepository.findAll();
    }

    public UsuariosEntity obtenerUsuarioPorId(Integer id) {
        Optional<UsuariosEntity> usuarioOptional = usuariosRepository.findById(id);
        return usuarioOptional.orElse(null);
    }

    public UsuariosEntity obtenerUsuarioLogin(String correo, String pass){
        return usuariosRepository.findByEmailAndPassword(correo,pass);
    }
    public UsuariosEntity obtenerUsuarioCorreo(String correo){
        return usuariosRepository.findByEmail(correo);
    }
    public Optional<UsuariosEntity>  obtenerUsuarioId(int idUser){
        return usuariosRepository.findById(idUser);
    }

    public void eliminarUsuario(int IdUsuarios){
        usuariosRepository.deleteById(IdUsuarios);
    }
}