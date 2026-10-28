package com.caretea.controller;

import com.caretea.dto.MeuDiaResponseDTO;
import com.caretea.dto.RegistrarHumorMeuDiaRequestDTO;
import com.caretea.model.PedidoAjudaMeuDia;
import com.caretea.service.MeuDiaService;
import com.caretea.service.PedidoAjudaMeuDiaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/meu-dia")
public class MeuDiaController {

    private final MeuDiaService meuDiaService;
    private final PedidoAjudaMeuDiaService pedidoAjudaMeuDiaService;

    public MeuDiaController(
            MeuDiaService meuDiaService,
            PedidoAjudaMeuDiaService pedidoAjudaMeuDiaService
    ) {
        this.meuDiaService =
                meuDiaService;

        this.pedidoAjudaMeuDiaService =
                pedidoAjudaMeuDiaService;
    }

    @GetMapping("/painel")
    public ResponseEntity<MeuDiaResponseDTO> carregarPainel(
            @RequestHeader("X-Meu-Dia-Token") String token
    ) {

        MeuDiaResponseDTO response =
                meuDiaService.carregarPainel(
                        token
                );

        return ResponseEntity.ok(
                response
        );
    }

    @PostMapping("/humor")
    public ResponseEntity<Map<String, String>> registrarHumor(
            @RequestHeader("X-Meu-Dia-Token") String token,
            @RequestBody RegistrarHumorMeuDiaRequestDTO request
    ) {

        String humor =
                meuDiaService.registrarHumor(
                        token,
                        request.humor()
                );

        return ResponseEntity.ok(
                Map.of(
                        "humor",
                        humor
                )
        );
    }

    @PostMapping("/medicamentos/{medicamentoId}/confirmar")
    public ResponseEntity<Void> confirmarMedicamento(
            @RequestHeader("X-Meu-Dia-Token") String token,
            @PathVariable Long medicamentoId
    ) {

        meuDiaService.confirmarDose(
                token,
                medicamentoId
        );

        return ResponseEntity.noContent()
                .build();
    }

    @PostMapping("/ajuda")
    public ResponseEntity<Map<String, Object>> pedirAjuda(
            @RequestHeader("X-Meu-Dia-Token") String token
    ) {

        PedidoAjudaMeuDia pedido =
                pedidoAjudaMeuDiaService.pedirAjuda(
                        token
                );

        Map<String, Object> response =
                Map.of(
                        "id",
                        pedido.getId(),

                        "pessoaAutistaId",
                        pedido.getPessoaAutista().getId(),

                        "solicitadoEm",
                        pedido.getSolicitadoEm().toString(),

                        "atendido",
                        pedido.isAtendido()
                );

        return ResponseEntity.status(
                HttpStatus.CREATED
        ).body(
                response
        );
    }
}