package com.levelup.gestionusuarios.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RolDTO {
    
    private Long id;
    private String nombre;
    private String descripcion;
    private Set<PermisoDTO> permisos;
}
