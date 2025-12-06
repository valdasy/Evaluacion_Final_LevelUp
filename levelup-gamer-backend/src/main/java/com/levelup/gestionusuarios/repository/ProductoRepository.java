package com.levelup.gestionusuarios.repository;

import com.levelup.gestionusuarios.entity.ProductoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<ProductoEntity, Long> {
    
    List<ProductoEntity> findByActivo(Boolean activo);
    
    List<ProductoEntity> findByDestacado(Boolean destacado);
    
    List<ProductoEntity> findByCategoriaId(Long categoriaId);
    
    List<ProductoEntity> findByNombreContainingIgnoreCase(String nombre);
    
    @Query("SELECT p FROM ProductoEntity p WHERE p.activo = true AND p.stock > 0")
    List<ProductoEntity> findProductosDisponibles();
    
    @Query("SELECT p FROM ProductoEntity p WHERE p.categoria.id = :categoriaId AND p.activo = true")
    List<ProductoEntity> findActivosPorCategoria(@Param("categoriaId") Long categoriaId);
}
