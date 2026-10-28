package com.caretea.controller;

import com.caretea.dto.PreferenciaNotificacaoDTO;
import com.caretea.service.PreferenciaNotificacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/preferencias-notificacao")
@CrossOrigin(origins = "*")
public class PreferenciaNotificacaoController {

    private final PreferenciaNotificacaoService preferenciaService;

    public PreferenciaNotificacaoController(
            PreferenciaNotificacaoService preferenciaService
    ) {
        this.preferenciaService = preferenciaService;
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<PreferenciaNotificacaoDTO> buscarPorUsuario(
            @PathVariable Long usuarioId
    ) {

        PreferenciaNotificacaoDTO preferencia =
                preferenciaService.buscarPorUsuario(usuarioId);

        return ResponseEntity.ok(preferencia);
    }

    @PutMapping("/usuario/{usuarioId}")
    public ResponseEntity<PreferenciaNotificacaoDTO> atualizar(
            @PathVariable Long usuarioId,
            @RequestBody PreferenciaNotificacaoDTO dto
    ) {

        PreferenciaNotificacaoDTO preferenciaAtualizada =
                preferenciaService.atualizar(usuarioId, dto);

        return ResponseEntity.ok(preferenciaAtualizada);
    }
}