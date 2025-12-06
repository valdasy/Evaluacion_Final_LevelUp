package com.levelup.gestionusuarios.security;

import com.levelup.gestionusuarios.entity.UsuarioEntity;
import com.levelup.gestionusuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Cargar usuario + roles
        UsuarioEntity usuario = usuarioRepository.findByEmailWithRoles(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

        // Logs de debug
        System.out.println("========================================");
        System.out.println("Usuario: " + usuario.getEmail());
        System.out.println("Roles count: " + usuario.getRoles().size());
        usuario.getRoles().forEach(rol -> System.out.println("Rol: " + rol.getNombre()));
        System.out.println("========================================");

        Set<GrantedAuthority> authorities = usuario.getRoles().stream()
                .map(rol -> new SimpleGrantedAuthority("ROLE_" + rol.getNombre()))
                .collect(Collectors.toSet());

        if (authorities.isEmpty()) {
            System.out.println("⚠️ No se encontraron roles, asignando USER por defecto");
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }

        return new User(
                usuario.getEmail(),
                usuario.getPassword(),
                usuario.getActivo(), // getActivo() (Boolean con Lombok)
                true,
                true,
                true,
                authorities
        );
    }
}
