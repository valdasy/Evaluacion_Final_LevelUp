package com.levelup.gestionusuarios.controller;

import com.levelup.gestionusuarios.entity.ProductoEntity;
import com.levelup.gestionusuarios.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@Tag(name = "Productos", description = "API para gestión de productos del catálogo")
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;
    
    @GetMapping
    @Operation(summary = "Obtener todos los productos")
    public ResponseEntity<List<ProductoEntity>> obtenerTodos() {
        return ResponseEntity.ok(productoService.obtenerTodos());
    }
    
    @GetMapping("/activos")
    @Operation(summary = "Obtener productos activos")
    public ResponseEntity<List<ProductoEntity>> obtenerActivos() {
        return ResponseEntity.ok(productoService.obtenerActivos());
    }
    
    @GetMapping("/destacados")
    @Operation(summary = "Obtener productos destacados")
    public ResponseEntity<List<ProductoEntity>> obtenerDestacados() {
        return ResponseEntity.ok(productoService.obtenerDestacados());
    }
    
    @GetMapping("/disponibles")
    @Operation(summary = "Obtener productos disponibles (activos con stock)")
    public ResponseEntity<List<ProductoEntity>> obtenerDisponibles() {
        return ResponseEntity.ok(productoService.obtenerDisponibles());
    }
    
    @GetMapping("/categoria/{categoriaId}")
    @Operation(summary = "Obtener productos por categoría")
    public ResponseEntity<List<ProductoEntity>> obtenerPorCategoria(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(productoService.obtenerPorCategoria(categoriaId));
    }
    
    @GetMapping("/buscar")
    @Operation(summary = "Buscar productos por nombre")
    public ResponseEntity<List<ProductoEntity>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(productoService.buscarPorNombre(nombre));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener producto por ID")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return productoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @Operation(summary = "Crear nuevo producto")
    public ResponseEntity<?> crear(@RequestBody ProductoEntity producto) {
        try {
            ProductoEntity nuevoProducto = productoService.crear(producto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar producto")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody ProductoEntity producto) {
        try {
            ProductoEntity productoActualizado = productoService.actualizar(id, producto);
            return ResponseEntity.ok(productoActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar producto")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            productoService.eliminar(id);
            return ResponseEntity.ok("Producto eliminado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado del producto")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam Boolean activo) {
        try {
            ProductoEntity producto = productoService.cambiarEstado(id, activo);
            return ResponseEntity.ok(producto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PatchMapping("/{id}/stock")
    @Operation(summary = "Actualizar stock del producto")
    public ResponseEntity<?> actualizarStock(@PathVariable Long id, @RequestParam Integer cantidad) {
        try {
            ProductoEntity producto = productoService.actualizarStock(id, cantidad);
            return ResponseEntity.ok(producto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
