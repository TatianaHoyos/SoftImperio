package com.imperio.service.repository;

import com.imperio.service.model.entity.PermisosEntity;
import com.imperio.service.model.entity.ProductoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermisosRepository extends JpaRepository<PermisosEntity,Integer> {


}
