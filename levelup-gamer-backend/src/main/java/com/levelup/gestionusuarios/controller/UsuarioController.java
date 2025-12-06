package com.levelup.gestionusuarios.controller;

import com.levelup.gestionusuarios.dto.UsuarioCreateDTO;  // ✅
import com.levelup.gestionusuarios.dto.UsuarioDTO;  // ✅
import com.levelup.gestionusuarios.service.UsuarioService;  // ✅
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    // POST - Crear nuevo usuario
    @PostMapping
    public ResponseEntity<UsuarioDTO> crearUsuario(@Valid @RequestBody UsuarioCreateDTO createDTO) {
        try {
            UsuarioDTO nuevoUsuario = usuarioService.crearUsuario(createDTO);
            return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    
    // GET - Obtener todos los usuarios
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> obtenerTodos() {
        List<UsuarioDTO> usuarios = usuarioService.obtenerTodos();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }
    
    // GET - Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtenerPorId(@PathVariable Long id) {
        try {
            UsuarioDTO usuario = usuarioService.obtenerPorId(id);
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    
    // GET - Obtener usuario por email
    @GetMapping("/email/{email}")
    public ResponseEntity<UsuarioDTO> obtenerPorEmail(@PathVariable String email) {
        try {
            UsuarioDTO usuario = usuarioService.obtenerPorEmail(email);
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    
    // GET - Obtener usuarios activos
    @GetMapping("/activos")
    public ResponseEntity<List<UsuarioDTO>> obtenerActivos() {
        List<UsuarioDTO> usuarios = usuarioService.obtenerUsuariosActivos();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }
    
    // GET - Buscar usuarios por nombre o apellido
    @GetMapping("/buscar")
    public ResponseEntity<List<UsuarioDTO>> buscarPorNombre(@RequestParam String termino) {
        List<UsuarioDTO> usuarios = usuarioService.buscarPorNombreOApellido(termino);
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }
    
    // PUT - Actualizar usuario
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> actualizarUsuario(
            @PathVariable Long id, 
            @Valid @RequestBody UsuarioDTO usuarioDTO) {
        try {
            UsuarioDTO usuarioActualizado = usuarioService.actualizarUsuario(id, usuarioDTO);
            return new ResponseEntity<>(usuarioActualizado, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    
    // DELETE - Eliminar usuario (borrado lógico)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        try {
            usuarioService.eliminarUsuario(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // DELETE - Eliminar usuario físicamente
    @DeleteMapping("/{id}/fisico")
    public ResponseEntity<Void> eliminarUsuarioFisico(@PathVariable Long id) {
        try {
            usuarioService.eliminarUsuarioFisico(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // POST - Agregar rol a usuario
    @PostMapping("/{usuarioId}/roles/{rolId}")
    public ResponseEntity<UsuarioDTO> agregarRol(
            @PathVariable Long usuarioId, 
            @PathVariable Long rolId) {
        try {
            UsuarioDTO usuario = usuarioService.agregarRol(usuarioId, rolId);
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    
    // DELETE - Remover rol de usuario
    @DeleteMapping("/{usuarioId}/roles/{rolId}")
    public ResponseEntity<UsuarioDTO> removerRol(
            @PathVariable Long usuarioId, 
            @PathVariable Long rolId) {
        try {
            UsuarioDTO usuario = usuarioService.removerRol(usuarioId, rolId);
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
}
