package com.imperio.service.repository;

import com.imperio.service.model.entity.OAuthEntity;
import com.imperio.service.model.entity.UsuariosEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OAuthRepository extends JpaRepository<OAuthEntity,Integer> {
    Optional<OAuthEntity> findByToken(String token);
    Optional<OAuthEntity> findByTokenRefresh(String token);

    @Modifying
    int deleteByUsuariosEntity(UsuariosEntity usuario);
}
