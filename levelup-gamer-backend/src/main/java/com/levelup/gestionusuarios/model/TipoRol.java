package com.levelup.gestionusuarios.model;

public enum TipoRol {
    ROLE_ADMIN("Administrador del sistema"),
    ROLE_USER("Usuario estándar"),
    ROLE_MODERATOR("Moderador de contenido");
    
    private final String descripcion;
    
    TipoRol(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
}
