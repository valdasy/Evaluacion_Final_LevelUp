package com.levelup.gestionusuarios.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.levelup.gestionusuarios.dto.PermisoDTO;
import com.levelup.gestionusuarios.dto.RolDTO;
import com.levelup.gestionusuarios.entity.PermisoEntity;
import com.levelup.gestionusuarios.entity.RolEntity;
import com.levelup.gestionusuarios.repository.PermisoRepository;
import com.levelup.gestionusuarios.repository.RolRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RolService {
    
    @Autowired
    private RolRepository rolRepository;
    
    @Autowired
    private PermisoRepository permisoRepository;
    
    // CREATE - Crear nuevo rol
    @Transactional
    public RolDTO crearRol(RolDTO rolDTO) {
        
        // Validar que el nombre no exista
        if (rolRepository.existsByNombre(rolDTO.getNombre())) {
            throw new RuntimeException("El rol con nombre " + rolDTO.getNombre() + " ya existe");
        }
        
        RolEntity rol = new RolEntity();
        rol.setNombre(rolDTO.getNombre());
        rol.setDescripcion(rolDTO.getDescripcion());
        
        RolEntity rolGuardado = rolRepository.save(rol);
        return convertirADTO(rolGuardado);
    }
    
    // READ - Obtener todos los roles
    @Transactional(readOnly = true)
    public List<RolDTO> obtenerTodos() {
        return rolRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    // READ - Obtener rol por ID
    @Transactional(readOnly = true)
    public RolDTO obtenerPorId(Long id) {
        RolEntity rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + id));
        return convertirADTO(rol);
    }
    
    // READ - Obtener rol por nombre
    @Transactional(readOnly = true)
    public RolDTO obtenerPorNombre(String nombre) {
        RolEntity rol = rolRepository.findByNombre(nombre)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con nombre: " + nombre));
        return convertirADTO(rol);
    }
    
    // UPDATE - Actualizar rol
    @Transactional
    public RolDTO actualizarRol(Long id, RolDTO rolDTO) {
        RolEntity rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + id));
        
        rol.setNombre(rolDTO.getNombre());
        rol.setDescripcion(rolDTO.getDescripcion());
        
        RolEntity rolActualizado = rolRepository.save(rol);
        return convertirADTO(rolActualizado);
    }
    
    // DELETE - Eliminar rol
    @Transactional
    public void eliminarRol(Long id) {
        if (!rolRepository.existsById(id)) {
            throw new RuntimeException("Rol no encontrado con ID: " + id);
        }
        rolRepository.deleteById(id);
    }
    
    // Agregar permiso a rol
    @Transactional
    public RolDTO agregarPermiso(Long rolId, Long permisoId) {
        RolEntity rol = rolRepository.findById(rolId)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        PermisoEntity permiso = permisoRepository.findById(permisoId)
                .orElseThrow(() -> new RuntimeException("Permiso no encontrado"));
        
        rol.getPermisos().add(permiso);
        RolEntity rolActualizado = rolRepository.save(rol);
        return convertirADTO(rolActualizado);
    }
    
    // Remover permiso de rol
    @Transactional
    public RolDTO removerPermiso(Long rolId, Long permisoId) {
        RolEntity rol = rolRepository.findById(rolId)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        PermisoEntity permiso = permisoRepository.findById(permisoId)
                .orElseThrow(() -> new RuntimeException("Permiso no encontrado"));
        
        rol.getPermisos().remove(permiso);
        RolEntity rolActualizado = rolRepository.save(rol);
        return convertirADTO(rolActualizado);
    }
    
    // Conversión de Entity a DTO
    private RolDTO convertirADTO(RolEntity entity) {
        RolDTO dto = new RolDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        
        // Convertir permisos
        Set<PermisoDTO> permisosDTO = entity.getPermisos().stream()
                .map(this::convertirPermisoADTO)
                .collect(Collectors.toSet());
        dto.setPermisos(permisosDTO);
        
        return dto;
    }
    
    private PermisoDTO convertirPermisoADTO(PermisoEntity entity) {
        PermisoDTO dto = new PermisoDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        dto.setRecurso(entity.getRecurso());
        dto.setMetodoHttp(entity.getMetodoHttp());
        return dto;
    }
}
