package com.levelup.gestionusuarios.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // IE11: Definir una cola en el sistema
    @Bean
    public Queue pedidosQueue() {
        // El nombre debe coincidir con el properties
        return new Queue("cola-pedidos-levelup", true);
    }
}