package com.caretea.controller;

import com.caretea.dto.AnaliseBemEstarIAResponseDTO;
import com.caretea.service.AnaliseBemEstarIAService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/ia/bem-estar")
@CrossOrigin(origins = "*")
public class AnaliseBemEstarIAController {

    private final AnaliseBemEstarIAService analiseBemEstarIAService;

    public AnaliseBemEstarIAController(
            AnaliseBemEstarIAService analiseBemEstarIAService
    ) {
        this.analiseBemEstarIAService =
                analiseBemEstarIAService;
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<AnaliseBemEstarIAResponseDTO> analisar(
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

        if (!usuarioAutenticadoId.equals(usuarioId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Você não tem permissão para acessar esses dados."
            );
        }

        AnaliseBemEstarIAResponseDTO analise =
                analiseBemEstarIAService
                        .analisar(
                                usuarioAutenticadoId,
                                inicio,
                                fim
                        );

        return ResponseEntity.ok(
                analise
        );
    }
}
