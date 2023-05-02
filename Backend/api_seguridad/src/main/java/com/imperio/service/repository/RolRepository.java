package com.imperio.service.repository;

import com.imperio.service.model.entity.RolEntity;
import com.imperio.service.model.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolRepository extends JpaRepository<RolEntity,Integer> {


}
