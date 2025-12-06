package com.levelup.gestionusuarios.controller;

import com.levelup.gestionusuarios.entity.OrdenEntity;
import com.levelup.gestionusuarios.repository.OrdenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

    @Autowired
    private OrdenRepository ordenRepository;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<OrdenEntity>> obtenerHistorial(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(ordenRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId));
    }
}