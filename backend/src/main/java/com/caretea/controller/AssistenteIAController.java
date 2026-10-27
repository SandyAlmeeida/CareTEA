package com.caretea.controller;

import com.caretea.dto.AssistenteChatRequestDTO;
import com.caretea.dto.AssistenteChatResponseDTO;
import com.caretea.service.AssistenteIAService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/assistente")
@CrossOrigin(origins = "*")
public class AssistenteIAController {

    private final AssistenteIAService assistenteIAService;

    public AssistenteIAController(
            AssistenteIAService assistenteIAService
    ) {
        this.assistenteIAService =
                assistenteIAService;
    }

    @PostMapping("/chat")
    public ResponseEntity<AssistenteChatResponseDTO> conversar(
            @RequestBody AssistenteChatRequestDTO request
    ) {
        return ResponseEntity.ok(
                assistenteIAService.conversar(request)
        );
    }
}