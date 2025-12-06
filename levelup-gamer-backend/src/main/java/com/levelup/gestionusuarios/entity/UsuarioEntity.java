package com.levelup.gestionusuarios.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String nombre;
    
    @Column(nullable = false, length = 100)
    private String apellido;
    
    @Column(unique = true, nullable = false, length = 150)
    private String email;
    
    @Column(nullable = false)
    private String password; // Guardada con BCrypt
    
    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;
    
    @Column(length = 15)
    private String telefono;
    
    @Column(length = 500)
    private String direccion;
    
    @Column(name = "es_mayor_edad")
    private Boolean esMayorEdad;
    
    @Column(name = "tiene_descuento_duoc")
    private Boolean tieneDescuentoDuoc; // 20% descuento si email contiene @duoc.cl
    
    @Column(name = "puntos_levelup")
    private Integer puntosLevelup = 0;
    
    @Column(nullable = false)
    private Boolean activo = true;
    
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;
    
    @Column(name = "ultima_actualizacion")
    private LocalDateTime ultimaActualizacion;
    
    // Relación Many-to-Many con RolEntity
    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "usuario_roles",
        joinColumns = @JoinColumn(name = "usuario_id"),
        inverseJoinColumns = @JoinColumn(name = "rol_id")
    )
    private Set<RolEntity> roles = new HashSet<>();
    
    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
        ultimaActualizacion = LocalDateTime.now();
        calcularEdad();
        verificarDescuentoDuoc();
    }
    
    @PreUpdate
    protected void onUpdate() {
        ultimaActualizacion = LocalDateTime.now();
        calcularEdad();
        verificarDescuentoDuoc();
    }
    
    // Método para calcular si es mayor de edad (>= 18 años)
    private void calcularEdad() {
        if (fechaNacimiento != null) {
            int edad = Period.between(fechaNacimiento, LocalDate.now()).getYears();
            this.esMayorEdad = edad >= 18;
        }
    }
    
    // Método para verificar descuento DUOC (20%)
    private void verificarDescuentoDuoc() {
        if (email != null) {
            this.tieneDescuentoDuoc = email.toLowerCase().contains("@duoc.cl");
        }
    }
    // Método helper para obtener nombre completo
    @Transient
    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }
}
