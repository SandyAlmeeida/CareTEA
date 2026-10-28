package com.caretea.controller;

import com.caretea.dto.RegistroBemEstarRequestDTO;
import com.caretea.dto.RegistroBemEstarResponseDTO;
import com.caretea.service.RegistroBemEstarService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/bem-estar")
@CrossOrigin(origins = "*")
public class RegistroBemEstarController {

    private final RegistroBemEstarService registroBemEstarService;

    public RegistroBemEstarController(
            RegistroBemEstarService registroBemEstarService
    ) {
        this.registroBemEstarService =
                registroBemEstarService;
    }

    @PostMapping
    public ResponseEntity<RegistroBemEstarResponseDTO> criar(
            @RequestBody RegistroBemEstarRequestDTO dto,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long usuarioAutenticadoId = Long.valueOf(jwt.getSubject());

        if (dto.getUsuarioId() != null
                && !usuarioAutenticadoId.equals(dto.getUsuarioId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Você não tem permissão para registrar dados de outro usuário."
            );
        }

        RegistroBemEstarResponseDTO registro =
                registroBemEstarService.criar(
                        dto
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(registro);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<RegistroBemEstarResponseDTO>>
    listarPorUsuario(
            @PathVariable Long usuarioId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long usuarioAutenticadoId = Long.valueOf(jwt.getSubject());
        validarUsuarioAutenticado(usuarioId, usuarioAutenticadoId);

        List<RegistroBemEstarResponseDTO> registros =
                registroBemEstarService
                        .listarPorUsuario(
                                usuarioAutenticadoId
                        );

        return ResponseEntity.ok(
                registros
        );
    }

    @GetMapping("/usuario/{usuarioId}/periodo")
    public ResponseEntity<List<RegistroBemEstarResponseDTO>>
    listarPorPeriodo(
            @PathVariable Long usuarioId,

            @RequestParam
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE_TIME
            )
            LocalDateTime inicio,

            @RequestParam
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE_TIME
            )
            LocalDateTime fim,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long usuarioAutenticadoId = Long.valueOf(jwt.getSubject());
        validarUsuarioAutenticado(usuarioId, usuarioAutenticadoId);

        List<RegistroBemEstarResponseDTO> registros =
                registroBemEstarService
                        .listarPorPeriodo(
                                usuarioAutenticadoId,
                                inicio,
                                fim
                        );

        return ResponseEntity.ok(
                registros
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long usuarioAutenticadoId = Long.valueOf(jwt.getSubject());

        registroBemEstarService.excluir(
                id,
                usuarioAutenticadoId
        );

        return ResponseEntity
                .noContent()
                .build();
    }

    private void validarUsuarioAutenticado(
            Long usuarioId,
            Long usuarioAutenticadoId
    ) {
        if (!usuarioAutenticadoId.equals(usuarioId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Você não tem permissão para acessar esses dados."
            );
        }
    }
}
