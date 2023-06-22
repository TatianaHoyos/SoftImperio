package com.imperio.service.repository;

import com.imperio.service.model.entity.ConfiguracionEntity;
import com.imperio.service.model.entity.PermisosEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfiguracionRepository extends JpaRepository<ConfiguracionEntity,Integer> {

    //ConfiguracionEntity findByIdRolAndIdPermisos (int idRol, int idPermisos);

    /*@Modifying
    @Query("DELETE FROM ConfiguracionEntity c WHERE c.IdRol = :IdRol")
    void deleteByRolId(int IdRol);*/
    void deleteByIdRol(int IdRol);
}
