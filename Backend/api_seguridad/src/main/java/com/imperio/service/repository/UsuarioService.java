package com.imperio.service.repository;

import com.imperio.service.model.entity.UsuarioEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    public UsuarioEntity obtenerUsuario(String correo, String pass){
        return usuarioRepository.findByCorreoAndPassword(correo,pass);
    }
}
