package com.caretea.controller;

import com.caretea.dto.DashboardBemEstarResponseDTO;
import com.caretea.service.DashboardBemEstarService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/dashboard/bem-estar")
@CrossOrigin(origins = "*")
public class DashboardBemEstarController {

    private final DashboardBemEstarService dashboardBemEstarService;

    public DashboardBemEstarController(
            DashboardBemEstarService dashboardBemEstarService
    ) {
        this.dashboardBemEstarService =
                dashboardBemEstarService;
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<DashboardBemEstarResponseDTO> gerarResumo(
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

        DashboardBemEstarResponseDTO resumo =
                dashboardBemEstarService
                        .gerarResumo(
                                usuarioAutenticadoId,
                                inicio,
                                fim
                        );

        return ResponseEntity.ok(
                resumo
        );
    }
}
