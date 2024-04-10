package com.imperio.service.repository;

import com.imperio.service.model.entity.CategoriaEntity;
import com.imperio.service.model.entity.ComprasEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompraRepository extends JpaRepository<ComprasEntity,Integer> {
}
