package com.levelup.gestionusuarios.controller;

import com.levelup.gestionusuarios.entity.CarritoEntity;
import com.levelup.gestionusuarios.entity.OrdenEntity;
import com.levelup.gestionusuarios.repository.OrdenRepository;
import com.levelup.gestionusuarios.service.CarritoService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private CarritoService carritoService;

    @Autowired
    private OrdenRepository ordenRepository; // ✅ 1. Inyectamos el repo

    @PostMapping("/procesar")
    public ResponseEntity<?> realizarCompra(@RequestParam Long usuarioId) {
        
        CarritoEntity carrito = carritoService.obtenerOCrearCarrito(usuarioId);
        
        if (carrito.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("El carrito está vacío");
        }

        // ✅ 2. GUARDAR LA ORDEN EN BASE DE DATOS (Lo que faltaba)
        OrdenEntity nuevaOrden = new OrdenEntity();
        nuevaOrden.setUsuarioId(usuarioId);
        nuevaOrden.setTotal(carrito.getTotal());
        nuevaOrden.setEstado("COMPLETADA");
        
        ordenRepository.save(nuevaOrden); // ¡Aquí se guarda el historial!

        // 3. Enviar a RabbitMQ
        String mensajeOrden = "Nueva Compra #" + nuevaOrden.getId();
        rabbitTemplate.convertAndSend("cola-pedidos-levelup", mensajeOrden);

        // 4. Vaciar Carrito (Ahora funcionará porque la transacción se completó)
        carritoService.vaciarCarrito(usuarioId);

        return ResponseEntity.ok("Compra realizada con éxito. Orden #" + nuevaOrden.getId());
    }
}