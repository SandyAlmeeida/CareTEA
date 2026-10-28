package com.caretea.controller;

import com.caretea.service.WhatsappService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/whatsapp")
@CrossOrigin(origins = "*")
public class WhatsappController {

    private final WhatsappService whatsappService;

    public WhatsappController(
            WhatsappService whatsappService
    ) {
        this.whatsappService = whatsappService;
    }

    @PostMapping("/teste")
    public ResponseEntity<String> enviarMensagemTeste(
            @RequestParam String numero,
            @RequestParam String mensagem
    ) {

        whatsappService.enviarMensagem(
                numero,
                mensagem
        );

        return ResponseEntity.ok(
                "Mensagem enviada com sucesso."
        );
    }

    @PostMapping("/teste-template-medicamento")
    public ResponseEntity<String> testarTemplateMedicamento(
            @RequestParam String numero,
            @RequestParam String medicamento,
            @RequestParam String dosagem,
            @RequestParam String horario
    ) {

        whatsappService.enviarTemplate(
                numero,
                "caretea_medicamento",
                "pt_BR",
                List.of(
                        medicamento,
                        dosagem,
                        horario
                )
        );

        return ResponseEntity.ok(
                "Template de medicamento enviado com sucesso."
        );
    }
}