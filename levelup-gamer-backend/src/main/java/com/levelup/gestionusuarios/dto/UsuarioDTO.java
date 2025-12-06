package com.levelup.gestionusuarios.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    // NO incluimos password por seguridad
    private LocalDate fechaNacimiento;
    private String telefono;
    private String direccion;
    private Boolean esMayorEdad;
    private Boolean tieneDescuentoDuoc;
    private Integer puntosLevelup;
    private Boolean activo;
    private LocalDateTime fechaRegistro;
    private LocalDateTime ultimaActualizacion;
    private Set<RolDTO> roles;
}
