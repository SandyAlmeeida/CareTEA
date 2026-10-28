package com.caretea.controller;

import com.caretea.dto.LembreteRequestDTO;
import com.caretea.dto.LembreteResponseDTO;
import com.caretea.service.LembreteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lembretes")
@CrossOrigin(origins = "*")
public class LembreteController {

    private final LembreteService lembreteService;

    public LembreteController(LembreteService lembreteService) {
        this.lembreteService = lembreteService;
    }

    @PostMapping
    public ResponseEntity<LembreteResponseDTO> criar(
            @RequestBody LembreteRequestDTO dto
    ) {
        LembreteResponseDTO lembrete = lembreteService.criar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(lembrete);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<LembreteResponseDTO>> listarPorUsuario(
            @PathVariable Long usuarioId
    ) {
        List<LembreteResponseDTO> lembretes =
                lembreteService.listarPorUsuario(usuarioId);

        return ResponseEntity.ok(lembretes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LembreteResponseDTO> buscarPorId(
            @PathVariable Long id
    ) {
        LembreteResponseDTO lembrete =
                lembreteService.buscarPorId(id);

        return ResponseEntity.ok(lembrete);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id
    ) {
        lembreteService.excluir(id);

        return ResponseEntity.noContent().build();
    }
}
