package com.imperio.service.repository;

import com.imperio.service.model.entity.UsuarioEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    public UsuarioEntity obtenerUsuario(String email, String pass){
        return usuarioRepository.findByEmailAndPassword(email,pass);
    }

    public UsuarioEntity crearUsuario(UsuarioEntity usuario){
        return  usuarioRepository.save(usuario);
    }
}

