package com.imperio.service.repository;

import com.imperio.service.model.entity.RolEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolService {

    @Autowired
    private RolRepository rolRepository;

    public List<RolEntity> obtenerRoles(){
        return rolRepository.findAll();
    }
    public  RolEntity guardarRol( RolEntity rol){
        return rolRepository.save(rol);
    }
    public void eliminarRol(int idRol){
       //var rol = rolRepository.findById(idRol);
       rolRepository.deleteById(idRol);
    }
}
