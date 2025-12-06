package com.levelup.gestionusuarios.repository;

import com.levelup.gestionusuarios.entity.CarritoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarritoRepository extends JpaRepository<CarritoEntity, Long> {
    Optional<CarritoEntity> findByUsuarioId(Long usuarioId);
    boolean existsByUsuarioId(Long usuarioId);
}
