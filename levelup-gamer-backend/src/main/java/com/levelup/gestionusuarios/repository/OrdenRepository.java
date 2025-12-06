package com.levelup.gestionusuarios.repository;

import com.levelup.gestionusuarios.entity.OrdenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrdenRepository extends JpaRepository<OrdenEntity, Long> {
    List<OrdenEntity> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);
}