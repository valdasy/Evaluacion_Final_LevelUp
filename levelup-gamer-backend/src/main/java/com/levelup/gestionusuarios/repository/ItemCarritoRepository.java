package com.levelup.gestionusuarios.repository;

import com.levelup.gestionusuarios.entity.ItemCarritoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemCarritoRepository extends JpaRepository<ItemCarritoEntity, Long> {
    Optional<ItemCarritoEntity> findByCarritoIdAndProductoId(Long carritoId, Long productoId);
}
