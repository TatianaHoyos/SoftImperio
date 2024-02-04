package com.imperio.service.repository;

import com.imperio.service.model.entity.OAuthEntity;
import com.imperio.service.model.entity.UsuariosEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class OAuthService {
    @Autowired
    private OAuthRepository oAuthRepository;

    public Optional<OAuthEntity> encontrarToken(String token){
        return oAuthRepository.findByToken(token);
    }
    public Optional<OAuthEntity> encontrarTokenRefresh(String token){
        return oAuthRepository.findByTokenRefresh(token);
    }

    public  OAuthEntity guardarToken(OAuthEntity oAuth){
        return  oAuthRepository.save(oAuth);
    }

   public int eliminarTokenUsuario(UsuariosEntity usuario){
        return oAuthRepository.deleteByUsuariosEntity(usuario);
    }

   public void eliminarToken(OAuthEntity oAuth){
         oAuthRepository.delete(oAuth);
    }
}
