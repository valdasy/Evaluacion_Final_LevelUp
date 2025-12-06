package com.levelup.gestionusuarios.controller;

import com.levelup.gestionusuarios.entity.CarritoEntity;
import com.levelup.gestionusuarios.service.CarritoService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    @Autowired
    private RabbitTemplate rabbitTemplate; // Tu mensajero

    @Autowired
    private CarritoService carritoService;
    
    // IE14: Componente Productor que envía mensajes a la cola
    @PostMapping("/procesar")
    public ResponseEntity<?> realizarCompra(@RequestParam Long usuarioId) {
        
        // 1. Obtenemos el carrito (simulando que esto es la orden)
        CarritoEntity carrito = carritoService.obtenerOCrearCarrito(usuarioId);
        
        if (carrito.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("El carrito está vacío");
        }

        // 2. Creamos un mensaje simple (String) con los datos clave
        String mensajeOrden = "Nueva Compra - Usuario: " + usuarioId + " - Total: " + carrito.getTotal();

        // 3. ¡ENVIAR A LA COLA! (Proceso Asíncrono)
        rabbitTemplate.convertAndSend("cola-pedidos-levelup", mensajeOrden);

        // 4. Vaciamos el carrito
        carritoService.vaciarCarrito(usuarioId);

        return ResponseEntity.ok("Compra recibida. Se procesará en segundo plano.");
    }
}