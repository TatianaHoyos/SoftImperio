package com.imperio.service.repository;

import com.imperio.service.model.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository  extends JpaRepository<UsuarioEntity,Integer> {
    UsuarioEntity findByCorreoAndPassword(String correo, String Password);
    UsuarioEntity findByCorreo(String correo);
}
