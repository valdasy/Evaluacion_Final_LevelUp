package com.levelup.gestionusuarios.controller;

import com.levelup.gestionusuarios.entity.CategoriaEntity;
import com.levelup.gestionusuarios.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@Tag(name = "Categorías", description = "API para gestión de categorías de productos")
public class CategoriaController {
    
    @Autowired
    private CategoriaService categoriaService;
    
    @GetMapping
    @Operation(summary = "Obtener todas las categorías")
    public ResponseEntity<List<CategoriaEntity>> obtenerTodas() {
        return ResponseEntity.ok(categoriaService.obtenerTodas());
    }
    
    @GetMapping("/activas")
    @Operation(summary = "Obtener categorías activas")
    public ResponseEntity<List<CategoriaEntity>> obtenerActivas() {
        return ResponseEntity.ok(categoriaService.obtenerActivas());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener categoría por ID")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return categoriaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @Operation(summary = "Crear nueva categoría")
    public ResponseEntity<?> crear(@RequestBody CategoriaEntity categoria) {
        try {
            CategoriaEntity nuevaCategoria = categoriaService.crear(categoria);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCategoria);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar categoría")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody CategoriaEntity categoria) {
        try {
            CategoriaEntity categoriaActualizada = categoriaService.actualizar(id, categoria);
            return ResponseEntity.ok(categoriaActualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar categoría")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            categoriaService.eliminar(id);
            return ResponseEntity.ok("Categoría eliminada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado de categoría")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam Boolean activo) {
        try {
            CategoriaEntity categoria = categoriaService.cambiarEstado(id, activo);
            return ResponseEntity.ok(categoria);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
