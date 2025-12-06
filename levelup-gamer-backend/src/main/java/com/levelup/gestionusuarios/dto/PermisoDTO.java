package com.levelup.gestionusuarios.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PermisoDTO {
    
    private Long id;
    private String nombre;
    private String descripcion;
    private String recurso;
    private String metodoHttp;
}
