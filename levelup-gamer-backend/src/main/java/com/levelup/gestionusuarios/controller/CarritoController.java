package com.levelup.gestionusuarios.controller;

import com.levelup.gestionusuarios.entity.CarritoEntity;
import com.levelup.gestionusuarios.repository.UsuarioRepository;
import com.levelup.gestionusuarios.service.CarritoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrito")
@Tag(name = "Carrito", description = "API para gestión del carrito de compras")
public class CarritoController {
    
    @Autowired
    private CarritoService carritoService;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    // Método helper para obtener el ID del usuario autenticado
    private Long getUsuarioId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuario no autenticado");
        }
        String email = authentication.getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"))
                .getId();
    }
    
    @GetMapping
    @Operation(summary = "Obtener carrito del usuario actual")
    public ResponseEntity<CarritoEntity> obtenerCarrito(Authentication authentication) {
        Long usuarioId = getUsuarioId(authentication);
        CarritoEntity carrito = carritoService.obtenerOCrearCarrito(usuarioId);
        return ResponseEntity.ok(carrito);
    }
    
    @PostMapping("/agregar")
    @Operation(summary = "Agregar producto al carrito")
    public ResponseEntity<?> agregarProducto(
            @RequestParam Long productoId,
            @RequestParam Integer cantidad,
            Authentication authentication) {
        try {
            Long usuarioId = getUsuarioId(authentication);
            CarritoEntity carrito = carritoService.agregarProducto(usuarioId, productoId, cantidad);
            return ResponseEntity.ok(carrito);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/actualizar/{itemId}")
    @Operation(summary = "Actualizar cantidad de un item")
    public ResponseEntity<?> actualizarCantidad(
            @PathVariable Long itemId,
            @RequestParam Integer cantidad,
            Authentication authentication) {
        try {
            Long usuarioId = getUsuarioId(authentication);
            CarritoEntity carrito = carritoService.actualizarCantidad(usuarioId, itemId, cantidad);
            return ResponseEntity.ok(carrito);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/eliminar/{itemId}")
    @Operation(summary = "Eliminar item del carrito")
    public ResponseEntity<?> eliminarItem(
            @PathVariable Long itemId,
            Authentication authentication) {
        try {
            Long usuarioId = getUsuarioId(authentication);
            CarritoEntity carrito = carritoService.eliminarItem(usuarioId, itemId);
            return ResponseEntity.ok(carrito);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/vaciar")
    @Operation(summary = "Vaciar carrito")
    public ResponseEntity<?> vaciarCarrito(Authentication authentication) {
        try {
            Long usuarioId = getUsuarioId(authentication);
            carritoService.vaciarCarrito(usuarioId);
            return ResponseEntity.ok("Carrito vaciado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
