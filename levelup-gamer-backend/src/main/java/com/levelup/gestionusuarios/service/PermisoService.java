package com.levelup.gestionusuarios.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.levelup.gestionusuarios.dto.PermisoDTO;
import com.levelup.gestionusuarios.entity.PermisoEntity;
import com.levelup.gestionusuarios.repository.PermisoRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PermisoService {
    
    @Autowired
    private PermisoRepository permisoRepository;
    
    // CREATE - Crear nuevo permiso
    @Transactional
    public PermisoDTO crearPermiso(PermisoDTO permisoDTO) {
        
        PermisoEntity permiso = new PermisoEntity();
        permiso.setNombre(permisoDTO.getNombre());
        permiso.setDescripcion(permisoDTO.getDescripcion());
        permiso.setRecurso(permisoDTO.getRecurso());
        permiso.setMetodoHttp(permisoDTO.getMetodoHttp());
        
        PermisoEntity permisoGuardado = permisoRepository.save(permiso);
        return convertirADTO(permisoGuardado);
    }
    
    // READ - Obtener todos los permisos
    @Transactional(readOnly = true)
    public List<PermisoDTO> obtenerTodos() {
        return permisoRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    // READ - Obtener permiso por ID
    @Transactional(readOnly = true)
    public PermisoDTO obtenerPorId(Long id) {
        PermisoEntity permiso = permisoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permiso no encontrado con ID: " + id));
        return convertirADTO(permiso);
    }
    
    // READ - Obtener permisos por método HTTP
    @Transactional(readOnly = true)
    public List<PermisoDTO> obtenerPorMetodoHttp(String metodoHttp) {
        return permisoRepository.findByMetodoHttp(metodoHttp).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    // READ - Obtener permisos por recurso
    @Transactional(readOnly = true)
    public List<PermisoDTO> obtenerPorRecurso(String recurso) {
        return permisoRepository.findByRecurso(recurso).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    // UPDATE - Actualizar permiso
    @Transactional
    public PermisoDTO actualizarPermiso(Long id, PermisoDTO permisoDTO) {
        PermisoEntity permiso = permisoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permiso no encontrado con ID: " + id));
        
        permiso.setNombre(permisoDTO.getNombre());
        permiso.setDescripcion(permisoDTO.getDescripcion());
        permiso.setRecurso(permisoDTO.getRecurso());
        permiso.setMetodoHttp(permisoDTO.getMetodoHttp());
        
        PermisoEntity permisoActualizado = permisoRepository.save(permiso);
        return convertirADTO(permisoActualizado);
    }
    
    // DELETE - Eliminar permiso
    @Transactional
    public void eliminarPermiso(Long id) {
        if (!permisoRepository.existsById(id)) {
            throw new RuntimeException("Permiso no encontrado con ID: " + id);
        }
        permisoRepository.deleteById(id);
    }
    
    // Conversión de Entity a DTO
    private PermisoDTO convertirADTO(PermisoEntity entity) {
        PermisoDTO dto = new PermisoDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        dto.setRecurso(entity.getRecurso());
        dto.setMetodoHttp(entity.getMetodoHttp());
        return dto;
    }
}
