package com.levelup.gestionusuarios.controller;

import com.levelup.gestionusuarios.dto.RolDTO;  // ✅ SIN guion bajo
import com.levelup.gestionusuarios.service.RolService;  // ✅ SIN guion bajo
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RolController {
    
    @Autowired
    private RolService rolService;
    
    // POST - Crear nuevo rol
    @PostMapping
    public ResponseEntity<RolDTO> crearRol(@Valid @RequestBody RolDTO rolDTO) {
        try {
            RolDTO nuevoRol = rolService.crearRol(rolDTO);
            return new ResponseEntity<>(nuevoRol, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    
    // GET - Obtener todos los roles
    @GetMapping
    public ResponseEntity<List<RolDTO>> obtenerTodos() {
        List<RolDTO> roles = rolService.obtenerTodos();
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }
    
    // GET - Obtener rol por ID
    @GetMapping("/{id}")
    public ResponseEntity<RolDTO> obtenerPorId(@PathVariable Long id) {
        try {
            RolDTO rol = rolService.obtenerPorId(id);
            return new ResponseEntity<>(rol, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    
    // GET - Obtener rol por nombre
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<RolDTO> obtenerPorNombre(@PathVariable String nombre) {
        try {
            RolDTO rol = rolService.obtenerPorNombre(nombre);
            return new ResponseEntity<>(rol, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    
    // PUT - Actualizar rol
    @PutMapping("/{id}")
    public ResponseEntity<RolDTO> actualizarRol(
            @PathVariable Long id, 
            @Valid @RequestBody RolDTO rolDTO) {
        try {
            RolDTO rolActualizado = rolService.actualizarRol(id, rolDTO);
            return new ResponseEntity<>(rolActualizado, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    
    // DELETE - Eliminar rol
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRol(@PathVariable Long id) {
        try {
            rolService.eliminarRol(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // POST - Agregar permiso a rol
    @PostMapping("/{rolId}/permisos/{permisoId}")
    public ResponseEntity<RolDTO> agregarPermiso(
            @PathVariable Long rolId, 
            @PathVariable Long permisoId) {
        try {
            RolDTO rol = rolService.agregarPermiso(rolId, permisoId);
            return new ResponseEntity<>(rol, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    
    // DELETE - Remover permiso de rol
    @DeleteMapping("/{rolId}/permisos/{permisoId}")
    public ResponseEntity<RolDTO> removerPermiso(
            @PathVariable Long rolId, 
            @PathVariable Long permisoId) {
        try {
            RolDTO rol = rolService.removerPermiso(rolId, permisoId);
            return new ResponseEntity<>(rol, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
}
