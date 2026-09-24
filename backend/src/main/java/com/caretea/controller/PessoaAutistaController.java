
package com.caretea.controller;

import com.caretea.dto.CadastroPessoaAutistaDTO;
import com.caretea.dto.PessoaAutistaRespostaDTO;

import com.caretea.model.PessoaAutista;
import com.caretea.repository.PessoaAutistaRepository;
import com.caretea.service.PessoaAutistaService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/pessoas-autistas")
@CrossOrigin(origins = "http://localhost:5173")
public class PessoaAutistaController {

    private final PessoaAutistaService pessoaAutistaService;
    private final PessoaAutistaRepository pessoaAutistaRepository;

    public PessoaAutistaController(
            PessoaAutistaService pessoaAutistaService,
            PessoaAutistaRepository pessoaAutistaRepository
    ) {
        this.pessoaAutistaService = pessoaAutistaService;
        this.pessoaAutistaRepository = pessoaAutistaRepository;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<PessoaAutistaRespostaDTO> cadastrar(
            @RequestBody CadastroPessoaAutistaDTO dto,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long usuarioAutenticadoId =
                Long.valueOf(jwt.getSubject());

        dto.setUsuarioId(usuarioAutenticadoId);

        PessoaAutista pessoaAutista =
                pessoaAutistaService.cadastrar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(PessoaAutistaRespostaDTO.de(pessoaAutista));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<PessoaAutistaRespostaDTO>> listarPorUsuario(
            @PathVariable Long usuarioId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long usuarioAutenticadoId =
                Long.valueOf(jwt.getSubject());

        if (!usuarioAutenticadoId.equals(usuarioId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Você não tem permissão para acessar esses dados."
            );
        }

        List<PessoaAutistaRespostaDTO> pessoas =
                pessoaAutistaRepository
                        .findByUsuarioId(usuarioAutenticadoId)
                        .stream()
                        .map(PessoaAutistaRespostaDTO::de)
                        .toList();

        return ResponseEntity.ok(pessoas);
    }
}