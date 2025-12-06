package com.levelup.gestionusuarios.service;

import com.levelup.gestionusuarios.entity.*;
import com.levelup.gestionusuarios.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@Transactional
public class CarritoService {
    
    @Autowired
    private CarritoRepository carritoRepository;
    
    @Autowired
    private ItemCarritoRepository itemCarritoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private ProductoRepository productoRepository;
    
    public CarritoEntity obtenerOCrearCarrito(Long usuarioId) {
        return carritoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> {
                    UsuarioEntity usuario = usuarioRepository.findById(usuarioId)
                            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                    
                    CarritoEntity nuevoCarrito = new CarritoEntity();
                    nuevoCarrito.setUsuario(usuario);
                    nuevoCarrito.setTotal(BigDecimal.ZERO);
                    
                    return carritoRepository.save(nuevoCarrito);
                });
    }
    
    public CarritoEntity agregarProducto(Long usuarioId, Long productoId, Integer cantidad) {
        CarritoEntity carrito = obtenerOCrearCarrito(usuarioId);
        ProductoEntity producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        if (producto.getStock() < cantidad) {
            throw new RuntimeException("Stock insuficiente");
        }
        
        Optional<ItemCarritoEntity> itemExistente = 
                itemCarritoRepository.findByCarritoIdAndProductoId(carrito.getId(), productoId);
        
        if (itemExistente.isPresent()) {
            ItemCarritoEntity item = itemExistente.get();
            item.setCantidad(item.getCantidad() + cantidad);
            item.calcularSubtotal();
            itemCarritoRepository.save(item);
        } else {
            ItemCarritoEntity nuevoItem = new ItemCarritoEntity();
            nuevoItem.setCarrito(carrito);
            nuevoItem.setProducto(producto);
            nuevoItem.setCantidad(cantidad);
            nuevoItem.setPrecioUnitario(producto.getPrecio());
            nuevoItem.calcularSubtotal();
            
            carrito.getItems().add(nuevoItem);
            itemCarritoRepository.save(nuevoItem);
        }
        
        carrito.calcularTotal();
        return carritoRepository.save(carrito);
    }
    
    public CarritoEntity actualizarCantidad(Long usuarioId, Long itemId, Integer cantidad) {
        CarritoEntity carrito = obtenerOCrearCarrito(usuarioId);
        ItemCarritoEntity item = itemCarritoRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));
        
        if (cantidad <= 0) {
            carrito.getItems().remove(item);
            itemCarritoRepository.delete(item);
        } else {
            if (item.getProducto().getStock() < cantidad) {
                throw new RuntimeException("Stock insuficiente");
            }
            item.setCantidad(cantidad);
            item.calcularSubtotal();
            itemCarritoRepository.save(item);
        }
        
        carrito.calcularTotal();
        return carritoRepository.save(carrito);
    }
    
    public CarritoEntity eliminarItem(Long usuarioId, Long itemId) {
        CarritoEntity carrito = obtenerOCrearCarrito(usuarioId);
        ItemCarritoEntity item = itemCarritoRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));
        
        carrito.getItems().remove(item);
        itemCarritoRepository.delete(item);
        
        carrito.calcularTotal();
        return carritoRepository.save(carrito);
    }
    
    public void vaciarCarrito(Long usuarioId) {
        CarritoEntity carrito = obtenerOCrearCarrito(usuarioId);
        carrito.getItems().clear();
        carrito.setTotal(BigDecimal.ZERO);
        carritoRepository.save(carrito);
    }
}