package com.imperio.service.repository;

import com.imperio.service.model.entity.UsuariosEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuariosRepository extends JpaRepository<UsuariosEntity,Integer> {

    UsuariosEntity findByEmailAndPassword(String email, String Password);
    UsuariosEntity findByEmail(String email);

}