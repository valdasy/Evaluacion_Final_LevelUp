package com.levelup.gestionusuarios.service;

import com.levelup.gestionusuarios.entity.ProductoEntity;
import com.levelup.gestionusuarios.entity.CategoriaEntity;
import com.levelup.gestionusuarios.repository.ProductoRepository;
import com.levelup.gestionusuarios.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private CategoriaRepository categoriaRepository;
    
    public List<ProductoEntity> obtenerTodos() {
        return productoRepository.findAll();
    }
    
    public List<ProductoEntity> obtenerActivos() {
        return productoRepository.findByActivo(true);
    }
    
    public List<ProductoEntity> obtenerDestacados() {
        return productoRepository.findByDestacado(true);
    }
    
    public List<ProductoEntity> obtenerDisponibles() {
        return productoRepository.findProductosDisponibles();
    }
    
    public List<ProductoEntity> obtenerPorCategoria(Long categoriaId) {
        return productoRepository.findActivosPorCategoria(categoriaId);
    }
    
    public List<ProductoEntity> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }
    
    public Optional<ProductoEntity> obtenerPorId(Long id) {
        return productoRepository.findById(id);
    }
    
    public ProductoEntity crear(ProductoEntity producto) {
        CategoriaEntity categoria = categoriaRepository.findById(producto.getCategoria().getId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        
        producto.setCategoria(categoria);
        return productoRepository.save(producto);
    }
    
    public ProductoEntity actualizar(Long id, ProductoEntity productoActualizado) {
        ProductoEntity producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        if (!producto.getCategoria().getId().equals(productoActualizado.getCategoria().getId())) {
            CategoriaEntity categoria = categoriaRepository.findById(productoActualizado.getCategoria().getId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            producto.setCategoria(categoria);
        }
        
        producto.setNombre(productoActualizado.getNombre());
        producto.setDescripcion(productoActualizado.getDescripcion());
        producto.setPrecio(productoActualizado.getPrecio());
        producto.setStock(productoActualizado.getStock());
        producto.setImagenUrl(productoActualizado.getImagenUrl());
        producto.setActivo(productoActualizado.getActivo());
        producto.setDestacado(productoActualizado.getDestacado());
        
        return productoRepository.save(producto);
    }
    
    public void eliminar(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado");
        }
        productoRepository.deleteById(id);
    }
    
    public ProductoEntity cambiarEstado(Long id, Boolean activo) {
        ProductoEntity producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        producto.setActivo(activo);
        return productoRepository.save(producto);
    }
    
    public ProductoEntity actualizarStock(Long id, Integer cantidad) {
        ProductoEntity producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        producto.setStock(producto.getStock() + cantidad);
        return productoRepository.save(producto);
    }
}