package com.levelup.gestionusuarios.repository;

import com.levelup.gestionusuarios.entity.CategoriaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<CategoriaEntity, Long> {
    
    Optional<CategoriaEntity> findByNombre(String nombre);
    
    List<CategoriaEntity> findByActivo(Boolean activo);
    
    Boolean existsByNombre(String nombre);
}
