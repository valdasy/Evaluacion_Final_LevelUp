package com.levelup.gestionusuarios.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "permisos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PermisoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 100)
    private String nombre; // USER_READ, USER_WRITE, PRODUCT_CREATE, etc.
    
    @Column(length = 255)
    private String descripcion;
    
    @Column(length = 100)
    private String recurso; // /api/usuarios, /api/productos
    
    @Column(name = "metodo_http", length = 10)
    private String metodoHttp; // GET, POST, PUT, DELETE
    
    // Relación Many-to-Many con RolEntity (lado inverso)
    @ManyToMany(mappedBy = "permisos")
    private Set<RolEntity> roles = new HashSet<>();
}
