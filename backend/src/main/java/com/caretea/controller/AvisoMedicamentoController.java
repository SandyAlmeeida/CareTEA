package com.caretea.controller;

import com.caretea.dto.AvisoMedicamentoRequestDTO;
import com.caretea.dto.LembreteResponseDTO;
import com.caretea.service.AvisoMedicamentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/avisos-medicamento")
@CrossOrigin(origins = "*")
public class AvisoMedicamentoController {

    private final AvisoMedicamentoService avisoMedicamentoService;

    public AvisoMedicamentoController(
            AvisoMedicamentoService avisoMedicamentoService
    ) {
        this.avisoMedicamentoService = avisoMedicamentoService;
    }

    @PostMapping
    public ResponseEntity<LembreteResponseDTO> criarAviso(
            @RequestBody AvisoMedicamentoRequestDTO dto
    ) {

        LembreteResponseDTO aviso =
                avisoMedicamentoService.criarAviso(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(aviso);
    }
}