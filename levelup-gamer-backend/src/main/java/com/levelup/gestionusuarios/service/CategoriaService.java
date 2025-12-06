package com.levelup.gestionusuarios.service;

import com.levelup.gestionusuarios.entity.CategoriaEntity;
import com.levelup.gestionusuarios.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {
    
    @Autowired
    private CategoriaRepository categoriaRepository;
    
    public List<CategoriaEntity> obtenerTodas() {
        return categoriaRepository.findAll();
    }
    
    public List<CategoriaEntity> obtenerActivas() {
        return categoriaRepository.findByActivo(true);
    }
    
    public Optional<CategoriaEntity> obtenerPorId(Long id) {
        return categoriaRepository.findById(id);
    }
    
    public CategoriaEntity crear(CategoriaEntity categoria) {
        if (categoriaRepository.existsByNombre(categoria.getNombre())) {
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        }
        return categoriaRepository.save(categoria);
    }
    
    public CategoriaEntity actualizar(Long id, CategoriaEntity categoriaActualizada) {
        CategoriaEntity categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        
        // Verificar nombre duplicado solo si cambió
        if (!categoria.getNombre().equals(categoriaActualizada.getNombre())) {
            if (categoriaRepository.existsByNombre(categoriaActualizada.getNombre())) {
                throw new RuntimeException("Ya existe una categoría con ese nombre");
            }
        }
        
        categoria.setNombre(categoriaActualizada.getNombre());
        categoria.setDescripcion(categoriaActualizada.getDescripcion());
        categoria.setActivo(categoriaActualizada.getActivo());
        
        return categoriaRepository.save(categoria);
    }
    
    public void eliminar(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoría no encontrada");
        }
        categoriaRepository.deleteById(id);
    }
    
    public CategoriaEntity cambiarEstado(Long id, Boolean activo) {
        CategoriaEntity categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        categoria.setActivo(activo);
        return categoriaRepository.save(categoria);
    }
}
