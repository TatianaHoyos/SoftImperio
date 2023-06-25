package com.imperio.service.repository;

import com.imperio.service.model.entity.ConfiguracionEntity;
import com.imperio.service.model.entity.PermisosEntity;
import com.imperio.service.model.entity.ProductoEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ConfiguracionService {
    @Autowired
    private ConfiguracionRepository configuracionRepository;

   /* public ConfiguracionEntity obtenerConfiguracionPorIdRolYIdPermisos(int idRol, int idPermisos){
        return configuracionRepository.findByIdRolAndIdPermisos(idRol,idPermisos);
    }*/

    public ConfiguracionEntity guardarConfiguracion(ConfiguracionEntity configuracion){
        return  configuracionRepository.save(configuracion);

    }
    @Transactional
    public void eliminarConfiguracion(int idRol){
        //var rol = rolRepository.findById(idRol);
        configuracionRepository.deleteByIdRol(idRol);
    }

}
