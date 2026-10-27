package com.caretea.controller;

import com.caretea.dto.EnvioWhatsappResponseDTO;
import com.caretea.service.EnvioWhatsappService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/envios-whatsapp")
@CrossOrigin(origins = "*")
public class EnvioWhatsappController {

    private final EnvioWhatsappService envioWhatsappService;

    public EnvioWhatsappController(
            EnvioWhatsappService envioWhatsappService
    ) {
        this.envioWhatsappService =
                envioWhatsappService;
    }

    @GetMapping("/lembrete/{lembreteId}")
    public ResponseEntity<List<EnvioWhatsappResponseDTO>>
    listarPorLembrete(
            @PathVariable Long lembreteId
    ) {

        List<EnvioWhatsappResponseDTO> envios =
                envioWhatsappService
                        .listarPorLembrete(
                                lembreteId
                        );

        return ResponseEntity.ok(
                envios
        );
    }
}