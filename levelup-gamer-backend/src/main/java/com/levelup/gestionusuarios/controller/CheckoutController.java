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
    private OrdenRepository ordenRepository; // ✅ Vital para guardar el historial

    @PostMapping("/procesar")
    public ResponseEntity<?> realizarCompra(@RequestParam Long usuarioId) {
        
        // 1. Obtener carrito
        CarritoEntity carrito = carritoService.obtenerOCrearCarrito(usuarioId);
        
        if (carrito.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("El carrito está vacío");
        }

        // 2. CREAR Y GUARDAR LA ORDEN (Esto faltaba)
        OrdenEntity nuevaOrden = new OrdenEntity();
        nuevaOrden.setUsuarioId(usuarioId);
        nuevaOrden.setTotal(carrito.getTotal());
        nuevaOrden.setEstado("COMPLETADA");
        
        ordenRepository.save(nuevaOrden); // ¡Guardado en BD!

        // 3. Enviar a RabbitMQ (Cola)
        String mensajeOrden = "Nueva Compra - Orden #" + nuevaOrden.getId();
        rabbitTemplate.convertAndSend("cola-pedidos-levelup", mensajeOrden);

        // 4. Vaciar Carrito (Ahora sí funciona porque la orden ya existe)
        carritoService.vaciarCarrito(usuarioId);

        return ResponseEntity.ok("Compra realizada con éxito. Orden #" + nuevaOrden.getId());
    }
}