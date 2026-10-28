package com.caretea.controller;

import com.caretea.dto.AvisoCompromissoRequestDTO;
import com.caretea.dto.LembreteResponseDTO;
import com.caretea.service.AvisoCompromissoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/avisos-compromisso")
@CrossOrigin(origins = "*")
public class AvisoCompromissoController {

    private final AvisoCompromissoService avisoCompromissoService;

    public AvisoCompromissoController(
            AvisoCompromissoService avisoCompromissoService
    ) {
        this.avisoCompromissoService = avisoCompromissoService;
    }

    @PostMapping
    public ResponseEntity<LembreteResponseDTO> criarAviso(
            @RequestBody AvisoCompromissoRequestDTO dto
    ) {

        LembreteResponseDTO aviso =
                avisoCompromissoService.criarAviso(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(aviso);
    }
}