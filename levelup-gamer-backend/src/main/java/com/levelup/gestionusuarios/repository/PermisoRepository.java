package com.levelup.gestionusuarios.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.levelup.gestionusuarios.entity.PermisoEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermisoRepository extends JpaRepository<PermisoEntity, Long> {
    
    Optional<PermisoEntity> findByNombre(String nombre);
    
    List<PermisoEntity> findByMetodoHttp(String metodoHttp);
    
    List<PermisoEntity> findByRecurso(String recurso);
    
    // Query objetal para buscar permisos por recurso y método
    @Query("SELECT p FROM PermisoEntity p WHERE p.recurso = :recurso AND p.metodoHttp = :metodo")
    Optional<PermisoEntity> findByRecursoAndMetodo(@Param("recurso") String recurso, @Param("metodo") String metodo);
}
