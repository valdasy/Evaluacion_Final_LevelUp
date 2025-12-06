package com.levelup.gestionusuarios.controller;

import com.levelup.gestionusuarios.dto.LoginRequest;
import com.levelup.gestionusuarios.dto.LoginResponse;
import com.levelup.gestionusuarios.dto.UsuarioCreateDTO;
import com.levelup.gestionusuarios.entity.RolEntity;
import com.levelup.gestionusuarios.entity.UsuarioEntity;
import com.levelup.gestionusuarios.repository.RolRepository;
import com.levelup.gestionusuarios.repository.UsuarioRepository;
import com.levelup.gestionusuarios.security.CustomUserDetailsService;
import com.levelup.gestionusuarios.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());

            UsuarioEntity usuario = usuarioRepository.findByEmailWithRoles(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            final String jwt = jwtUtil.generateToken(userDetails);

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                    .collect(Collectors.toList());

            LoginResponse response = new LoginResponse(
                    jwt,
                    usuario.getEmail(),
                    usuario.getNombreCompleto(),
                    roles
            );

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciales incorrectas");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error en el servidor: " + e.getMessage());
        }
    }

    // REGISTRO (con asignación de rol USER y login automático)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UsuarioCreateDTO registroDTO) {
        try {
            if (usuarioRepository.existsByEmail(registroDTO.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El email ya está registrado");
            }

            UsuarioEntity usuario = new UsuarioEntity();
            usuario.setNombre(registroDTO.getNombre());
            usuario.setApellido(registroDTO.getApellido());
            usuario.setEmail(registroDTO.getEmail());
            usuario.setPassword(passwordEncoder.encode(registroDTO.getPassword()));
            usuario.setFechaNacimiento(registroDTO.getFechaNacimiento());
            usuario.setTelefono(registroDTO.getTelefono());
            usuario.setDireccion(registroDTO.getDireccion());
            usuario.setActivo(true);

            // Asignar rol USER por defecto
            RolEntity rolUser = rolRepository.findByNombre("USER")
                    .orElseThrow(() -> new RuntimeException("Rol USER no encontrado en la base de datos"));
            usuario.getRoles().add(rolUser);

            usuarioRepository.save(usuario);

            final UserDetails userDetails = userDetailsService.loadUserByUsername(usuario.getEmail());
            final String jwt = jwtUtil.generateToken(userDetails);

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                    .collect(Collectors.toList());

            LoginResponse response = new LoginResponse(
                    jwt,
                    usuario.getEmail(),
                    usuario.getNombre() + " " + usuario.getApellido(),
                    roles
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al registrar usuario: " + e.getMessage());
        }
    }
}
