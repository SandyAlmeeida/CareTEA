package com.caretea.controller;

import com.caretea.dto.NotificacaoResponseDTO;
import com.caretea.service.NotificacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notificacoes")
@CrossOrigin(origins = "*")
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    public NotificacaoController(NotificacaoService notificacaoService) {
        this.notificacaoService = notificacaoService;
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<NotificacaoResponseDTO>> listarPorUsuario(
            @PathVariable Long usuarioId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long usuarioAutenticadoId = Long.valueOf(jwt.getSubject());
        validarUsuarioAutenticado(usuarioId, usuarioAutenticadoId);

        List<NotificacaoResponseDTO> notificacoes =
                notificacaoService.listarPorUsuario(usuarioAutenticadoId);

        return ResponseEntity.ok(notificacoes);
    }

    @PatchMapping("/{id}/lida")
    public ResponseEntity<NotificacaoResponseDTO> marcarComoLida(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long usuarioAutenticadoId = Long.valueOf(jwt.getSubject());

        NotificacaoResponseDTO notificacao =
                notificacaoService.marcarComoLida(id, usuarioAutenticadoId);

        return ResponseEntity.ok(notificacao);
    }

    @GetMapping("/usuario/{usuarioId}/nao-lidas/quantidade")
    public ResponseEntity<Map<String, Long>> contarNaoLidas(
            @PathVariable Long usuarioId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long usuarioAutenticadoId = Long.valueOf(jwt.getSubject());
        validarUsuarioAutenticado(usuarioId, usuarioAutenticadoId);

        return ResponseEntity.ok(Map.of(
                "quantidade", notificacaoService.contarNaoLidas(usuarioAutenticadoId)
        ));
    }

    private void validarUsuarioAutenticado(Long usuarioId, Long usuarioAutenticadoId) {
        if (!usuarioAutenticadoId.equals(usuarioId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Você não tem permissão para acessar esses dados."
            );
        }
    }
}
