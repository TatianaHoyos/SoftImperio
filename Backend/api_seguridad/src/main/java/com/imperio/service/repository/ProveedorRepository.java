package com.imperio.service.repository;

import com.imperio.service.model.entity.ProveedoresEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProveedorRepository extends JpaRepository<ProveedoresEntity,Integer> {


}
