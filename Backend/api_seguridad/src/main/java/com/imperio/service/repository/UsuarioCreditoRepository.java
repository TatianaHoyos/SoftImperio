package com.imperio.service.repository;

import com.imperio.service.model.entity.UsuarioCreditoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioCreditoRepository extends JpaRepository<UsuarioCreditoEntity,Integer> {


}
