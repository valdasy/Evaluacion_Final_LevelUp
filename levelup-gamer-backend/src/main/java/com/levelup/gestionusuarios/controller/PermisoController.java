package com.levelup.gestionusuarios.controller;

import com.levelup.gestionusuarios.dto.PermisoDTO;  // ✅ SIN guion bajo
import com.levelup.gestionusuarios.service.PermisoService;  // ✅ SIN guion bajo
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/permisos")
public class PermisoController {
    
    @Autowired
    private PermisoService permisoService;
    
    // POST - Crear nuevo permiso
    @PostMapping
    public ResponseEntity<PermisoDTO> crearPermiso(@Valid @RequestBody PermisoDTO permisoDTO) {
        try {
            PermisoDTO nuevoPermiso = permisoService.crearPermiso(permisoDTO);
            return new ResponseEntity<>(nuevoPermiso, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    
    // GET - Obtener todos los permisos
    @GetMapping
    public ResponseEntity<List<PermisoDTO>> obtenerTodos() {
        List<PermisoDTO> permisos = permisoService.obtenerTodos();
        return new ResponseEntity<>(permisos, HttpStatus.OK);
    }
    
    // GET - Obtener permiso por ID
    @GetMapping("/{id}")
    public ResponseEntity<PermisoDTO> obtenerPorId(@PathVariable Long id) {
        try {
            PermisoDTO permiso = permisoService.obtenerPorId(id);
            return new ResponseEntity<>(permiso, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    
    // GET - Obtener permisos por método HTTP
    @GetMapping("/metodo/{metodoHttp}")
    public ResponseEntity<List<PermisoDTO>> obtenerPorMetodoHttp(@PathVariable String metodoHttp) {
        List<PermisoDTO> permisos = permisoService.obtenerPorMetodoHttp(metodoHttp);
        return new ResponseEntity<>(permisos, HttpStatus.OK);
    }
    
    // GET - Obtener permisos por recurso
    @GetMapping("/recurso/{recurso}")
    public ResponseEntity<List<PermisoDTO>> obtenerPorRecurso(@PathVariable String recurso) {
        List<PermisoDTO> permisos = permisoService.obtenerPorRecurso(recurso);
        return new ResponseEntity<>(permisos, HttpStatus.OK);
    }
    
    // PUT - Actualizar permiso
    @PutMapping("/{id}")
    public ResponseEntity<PermisoDTO> actualizarPermiso(
            @PathVariable Long id, 
            @Valid @RequestBody PermisoDTO permisoDTO) {
        try {
            PermisoDTO permisoActualizado = permisoService.actualizarPermiso(id, permisoDTO);
            return new ResponseEntity<>(permisoActualizado, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    
    // DELETE - Eliminar permiso
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPermiso(@PathVariable Long id) {
        try {
            permisoService.eliminarPermiso(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
