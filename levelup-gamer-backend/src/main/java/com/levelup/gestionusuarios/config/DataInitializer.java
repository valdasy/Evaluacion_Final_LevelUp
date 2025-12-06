package com.levelup.gestionusuarios.config;

import com.levelup.gestionusuarios.entity.CategoriaEntity;
import com.levelup.gestionusuarios.entity.ProductoEntity;
import com.levelup.gestionusuarios.entity.RolEntity;
import com.levelup.gestionusuarios.repository.CategoriaRepository;
import com.levelup.gestionusuarios.repository.ProductoRepository;
import com.levelup.gestionusuarios.repository.RolRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            RolRepository rolRepository,
            CategoriaRepository categoriaRepository,
            ProductoRepository productoRepository) {
        return args -> {
            // --- 1. CREACIÓN DE ROLES (CORREGIDO) ---
            // Usamos setters en lugar del constructor para evitar errores
            if (rolRepository.findByNombre("USER").isEmpty()) {
                RolEntity userRole = new RolEntity();
                userRole.setNombre("USER");
                rolRepository.save(userRole);
                System.out.println("✅ Rol USER creado.");
            }
            if (rolRepository.findByNombre("ADMIN").isEmpty()) {
                RolEntity adminRole = new RolEntity();
                adminRole.setNombre("ADMIN");
                rolRepository.save(adminRole);
                System.out.println("✅ Rol ADMIN creado.");
            }

            // --- 2. CREACIÓN DE CATEGORÍAS ---
            if (categoriaRepository.count() == 0) {
                CategoriaEntity consolas = new CategoriaEntity();
                consolas.setNombre("Consolas");
                consolas.setDescripcion("Consolas de última generación");
                consolas.setActivo(true);
                categoriaRepository.save(consolas);

                CategoriaEntity perifericos = new CategoriaEntity();
                perifericos.setNombre("Periféricos");
                perifericos.setDescripcion("Teclados, mouse y audífonos");
                perifericos.setActivo(true);
                categoriaRepository.save(perifericos);
                
                CategoriaEntity catConsolas = categoriaRepository.findByNombre("Consolas").orElse(null);
                CategoriaEntity catPerifericos = categoriaRepository.findByNombre("Periféricos").orElse(null);

                // --- 3. CREACIÓN DE PRODUCTOS ---
                if (catConsolas != null) {
                    ProductoEntity ps5 = new ProductoEntity();
                    ps5.setNombre("PlayStation 5");
                    ps5.setDescripcion("Consola Standard Edition 825GB");
                    ps5.setPrecio(new BigDecimal("549990"));
                    ps5.setStock(10);
                    ps5.setCategoria(catConsolas);
                    ps5.setImagenUrl("/images/ps5.webp");
                    ps5.setActivo(true);
                    ps5.setDestacado(true);
                    productoRepository.save(ps5);
                    
                    ProductoEntity control = new ProductoEntity();
                    control.setNombre("Control Xbox Series");
                    control.setDescripcion("Control inalámbrico Robot White");
                    control.setPrecio(new BigDecimal("59990"));
                    control.setStock(50);
                    control.setCategoria(catConsolas);
                    control.setImagenUrl("/images/controlx.webp");
                    control.setActivo(true);
                    control.setDestacado(false);
                    productoRepository.save(control);
                }
                
                if (catPerifericos != null) {
                    ProductoEntity mouse = new ProductoEntity();
                    mouse.setNombre("Mouse Gamer Logitech");
                    mouse.setDescripcion("Mouse G Pro Wireless");
                    mouse.setPrecio(new BigDecimal("99990"));
                    mouse.setStock(20);
                    mouse.setCategoria(catPerifericos);
                    mouse.setImagenUrl("/images/mouse.webp");
                    mouse.setActivo(true);
                    mouse.setDestacado(true);
                    productoRepository.save(mouse);
                }

                System.out.println("✅ Datos de prueba cargados exitosamente.");
            }
        };
    }
}