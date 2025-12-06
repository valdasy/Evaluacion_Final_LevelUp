package com.levelup.gestionusuarios.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.mindrot.jbcrypt.BCrypt; // <--- USAR ESTA LIBRERÍA
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.levelup.gestionusuarios.dto.PermisoDTO;
import com.levelup.gestionusuarios.dto.RolDTO;
import com.levelup.gestionusuarios.dto.UsuarioCreateDTO;
import com.levelup.gestionusuarios.dto.UsuarioDTO;
import com.levelup.gestionusuarios.entity.PermisoEntity;
import com.levelup.gestionusuarios.entity.RolEntity;
import com.levelup.gestionusuarios.entity.UsuarioEntity;
import com.levelup.gestionusuarios.repository.RolRepository;
import com.levelup.gestionusuarios.repository.UsuarioRepository;

import java.time.LocalDate;
import java.time.Period;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private RolRepository rolRepository;
    
    // CREATE - Crear nuevo usuario
    @Transactional
    public UsuarioDTO crearUsuario(UsuarioCreateDTO createDTO) {
        
        // Validar que el email no exista
        if (usuarioRepository.existsByEmail(createDTO.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        // Validar que sea mayor de 18 años
        int edad = Period.between(createDTO.getFechaNacimiento(), LocalDate.now()).getYears();
        if (edad < 18) {
            throw new RuntimeException("Debe ser mayor de 18 años para registrarse");
        }
        
        // Convertir DTO a Entity
        UsuarioEntity usuario = new UsuarioEntity();
        usuario.setNombre(createDTO.getNombre());
        usuario.setApellido(createDTO.getApellido());
        usuario.setEmail(createDTO.getEmail());
        
        // Encriptar password con BCrypt (jbcrypt library)
        String passwordEncriptado = BCrypt.hashpw(createDTO.getPassword(), BCrypt.gensalt(12));
        usuario.setPassword(passwordEncriptado);
        
        usuario.setFechaNacimiento(createDTO.getFechaNacimiento());
        usuario.setTelefono(createDTO.getTelefono());
        usuario.setDireccion(createDTO.getDireccion());
        usuario.setActivo(true);
        usuario.setPuntosLevelup(0);
        
        // Asignar rol USER por defecto
        RolEntity rolUser = rolRepository.findByNombre("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Rol USER no encontrado"));
        usuario.getRoles().add(rolUser);
        
        UsuarioEntity usuarioGuardado = usuarioRepository.save(usuario);
        
        return convertirADTO(usuarioGuardado);
    }
    
    // Método para verificar password (útil para login futuro)
    public boolean verificarPassword(String passwordPlano, String passwordEncriptado) {
        return BCrypt.checkpw(passwordPlano, passwordEncriptado);
    }
    
    // READ - Obtener todos los usuarios
    @Transactional(readOnly = true)
    public List<UsuarioDTO> obtenerTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    // READ - Obtener usuario por ID
    @Transactional(readOnly = true)
    public UsuarioDTO obtenerPorId(Long id) {
        UsuarioEntity usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        return convertirADTO(usuario);
    }
    
    // READ - Obtener usuario por email
    @Transactional(readOnly = true)
    public UsuarioDTO obtenerPorEmail(String email) {
        UsuarioEntity usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
        return convertirADTO(usuario);
    }
    
    // READ - Obtener usuarios activos
    @Transactional(readOnly = true)
    public List<UsuarioDTO> obtenerUsuariosActivos() {
        return usuarioRepository.findByActivo(true).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    // READ - Buscar usuarios por nombre o apellido
    @Transactional(readOnly = true)
    public List<UsuarioDTO> buscarPorNombreOApellido(String termino) {
        return usuarioRepository.buscarPorNombreOApellido(termino, termino).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    // UPDATE - Actualizar usuario
    @Transactional
    public UsuarioDTO actualizarUsuario(Long id, UsuarioDTO usuarioDTO) {
        UsuarioEntity usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        
        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setApellido(usuarioDTO.getApellido());
        usuario.setTelefono(usuarioDTO.getTelefono());
        usuario.setDireccion(usuarioDTO.getDireccion());
        
        UsuarioEntity usuarioActualizado = usuarioRepository.save(usuario);
        return convertirADTO(usuarioActualizado);
    }
    
    // UPDATE - Cambiar password
    @Transactional
    public void cambiarPassword(Long id, String nuevaPassword) {
        UsuarioEntity usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        
        String passwordEncriptado = BCrypt.hashpw(nuevaPassword, BCrypt.gensalt(12));
        usuario.setPassword(passwordEncriptado);
        usuarioRepository.save(usuario);
    }
    
    // DELETE - Eliminar usuario (borrado lógico)
    @Transactional
    public void eliminarUsuario(Long id) {
        UsuarioEntity usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }
    
    // DELETE - Eliminar usuario físicamente
    @Transactional
    public void eliminarUsuarioFisico(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }
    
    // Método para agregar rol a usuario
    @Transactional
    public UsuarioDTO agregarRol(Long usuarioId, Long rolId) {
        UsuarioEntity usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        RolEntity rol = rolRepository.findById(rolId)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        
        usuario.getRoles().add(rol);
        UsuarioEntity usuarioActualizado = usuarioRepository.save(usuario);
        return convertirADTO(usuarioActualizado);
    }
    
    // Método para remover rol de usuario
    @Transactional
    public UsuarioDTO removerRol(Long usuarioId, Long rolId) {
        UsuarioEntity usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        RolEntity rol = rolRepository.findById(rolId)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        
        usuario.getRoles().remove(rol);
        UsuarioEntity usuarioActualizado = usuarioRepository.save(usuario);
        return convertirADTO(usuarioActualizado);
    }
    
    // Conversión de Entity a DTO
    private UsuarioDTO convertirADTO(UsuarioEntity entity) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setApellido(entity.getApellido());
        dto.setEmail(entity.getEmail());
        dto.setFechaNacimiento(entity.getFechaNacimiento());
        dto.setTelefono(entity.getTelefono());
        dto.setDireccion(entity.getDireccion());
        dto.setEsMayorEdad(entity.getEsMayorEdad());
        dto.setTieneDescuentoDuoc(entity.getTieneDescuentoDuoc());
        dto.setPuntosLevelup(entity.getPuntosLevelup());
        dto.setActivo(entity.getActivo());
        dto.setFechaRegistro(entity.getFechaRegistro());
        dto.setUltimaActualizacion(entity.getUltimaActualizacion());
        
        // Convertir roles
        Set<RolDTO> rolesDTO = entity.getRoles().stream()
                .map(this::convertirRolADTO)
                .collect(Collectors.toSet());
        dto.setRoles(rolesDTO);
        
        return dto;
    }
    
    private RolDTO convertirRolADTO(RolEntity entity) {
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
