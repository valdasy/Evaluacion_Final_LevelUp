package com.levelup.gestionusuarios.functions;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.function.Consumer;

@Configuration
public class ProcesarPedidoFunction {

    // IE10: Diseño de funciones serverless (FaaS)
    // IE13: Integración de función con servicios (RabbitMQ)
    // Esta función actúa como el "Worker" que procesa lo pesado
    
    @Bean
    public Consumer<String> procesarOrden() {
        return (mensaje) -> {
            // Lógica asíncrona (simulada)
            System.out.println("------------------------------------------------");
            System.out.println("⚡ SERVERLESS FUNCTION ACTIVADA ⚡");
            System.out.println("📥 Recibido mensaje de la cola: " + mensaje);
            System.out.println("📧 Enviando correo de confirmación (simulado)...");
            System.out.println("✅ Orden procesada con éxito.");
            System.out.println("------------------------------------------------");
        };
    }
    
    // Conector explícito para escuchar RabbitMQ
    @RabbitListener(queues = "cola-pedidos-levelup")
    public void escucharCola(String mensaje) {
        procesarOrden().accept(mensaje);
    }
}