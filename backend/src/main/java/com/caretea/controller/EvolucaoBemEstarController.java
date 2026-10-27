package com.caretea.controller;

import com.caretea.dto.EvolucaoBemEstarDTO;
import com.caretea.service.EvolucaoBemEstarService;
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
@RequestMapping("/dashboard/bem-estar/evolucao")
@CrossOrigin(origins = "*")
public class EvolucaoBemEstarController {

    private final EvolucaoBemEstarService evolucaoBemEstarService;

    public EvolucaoBemEstarController(
            EvolucaoBemEstarService evolucaoBemEstarService
    ) {
        this.evolucaoBemEstarService =
                evolucaoBemEstarService;
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<EvolucaoBemEstarDTO>> buscarEvolucao(
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

        List<EvolucaoBemEstarDTO> evolucao =
                evolucaoBemEstarService
                        .buscarEvolucao(
                                usuarioAutenticadoId,
                                inicio,
                                fim
                        );

        return ResponseEntity.ok(
                evolucao
        );
    }
}
