
package com.caretea.controller;

import com.caretea.dto.CadastroUsuarioDTO;
import com.caretea.dto.LoginDTO;
import com.caretea.dto.LoginResponseDTO;
import com.caretea.dto.LoginTokenResponseDTO;
import com.caretea.model.Usuario;
import com.caretea.service.JwtService;
import com.caretea.service.UsuarioService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;

    public UsuarioController(
            UsuarioService usuarioService,
            JwtService jwtService
    ) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<LoginResponseDTO> cadastrar(
            @RequestBody CadastroUsuarioDTO dto
    ) {

        Usuario usuario = usuarioService.cadastrar(dto);

        LoginResponseDTO resposta = montarResposta(usuario);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resposta);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginTokenResponseDTO> login(
            @RequestBody LoginDTO dto
    ) {

        Usuario usuario = usuarioService.login(dto);

        String token = jwtService.gerarToken(usuario);

        LoginResponseDTO dadosUsuario = montarResposta(usuario);

        LoginTokenResponseDTO resposta =
                new LoginTokenResponseDTO(
                        token,
                        dadosUsuario
                );

        return ResponseEntity.ok(resposta);
    }

    private LoginResponseDTO montarResposta(Usuario usuario) {

        return new LoginResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getWhatsapp(),
                usuario.getTipoUsuario()
        );
    }
}