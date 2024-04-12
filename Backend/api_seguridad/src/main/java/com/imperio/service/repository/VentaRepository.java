package com.imperio.service.repository;

import com.imperio.service.model.entity.ComprasEntity;
import com.imperio.service.model.entity.VentaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VentaRepository extends JpaRepository<VentaEntity,Integer> {
}
