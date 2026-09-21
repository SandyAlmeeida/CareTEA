package com.caretea.controller;

import com.caretea.model.Compromisso;
import com.caretea.service.CompromissoService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * API da agenda de compromissos (consultas, exames, terapias e outros).
 * Todos os endpoints são vinculados a um usuário: /usuarios/{usuarioId}/compromissos
 */
@RestController
@RequestMapping("/usuarios/{usuarioId}/compromissos")
public class CompromissoController {

    private final CompromissoService compromissoService;

    public CompromissoController(CompromissoService compromissoService) {
        this.compromissoService = compromissoService;
    }

    // POST /usuarios/{usuarioId}/compromissos — Cria um compromisso
    @PostMapping
    public ResponseEntity<Compromisso> criar(
            @PathVariable Long usuarioId,
            @Valid @RequestBody Compromisso compromisso) {

        Compromisso criado = compromissoService.criar(usuarioId, compromisso);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    // GET /usuarios/{usuarioId}/compromissos — Lista / busca por período
    //   ?periodo=dia|semana|mes&data=YYYY-MM-DD  → recorte por período
    //   ?inicio=YYYY-MM-DD&fim=YYYY-MM-DD        → intervalo livre
    //   ?tipo=consulta|terapia|exame|...         → filtro opcional por tipo
    //   (sem parâmetros)                          → todos do usuário
    @GetMapping
    public ResponseEntity<List<Compromisso>> listar(
            @PathVariable Long usuarioId,
            @RequestParam(required = false) String periodo,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {

        List<Compromisso> resultado;

        if (periodo != null) {
            resultado = compromissoService.listarPorPeriodo(usuarioId, periodo, data, tipo);
        } else if (inicio != null || fim != null) {
            resultado = compromissoService.listarPorIntervalo(usuarioId, inicio, fim, tipo);
        } else {
            resultado = compromissoService.listar(usuarioId, tipo);
        }

        return ResponseEntity.ok(resultado);
    }

    // GET /usuarios/{usuarioId}/compromissos/{id} — Detalha um compromisso
    @GetMapping("/{id}")
    public ResponseEntity<Compromisso> buscarPorId(
            @PathVariable Long usuarioId,
            @PathVariable Long id) {

        return ResponseEntity.ok(compromissoService.buscarPorId(usuarioId, id));
    }

    // PUT /usuarios/{usuarioId}/compromissos/{id} — Edita um compromisso
    @PutMapping("/{id}")
    public ResponseEntity<Compromisso> atualizar(
            @PathVariable Long usuarioId,
            @PathVariable Long id,
            @Valid @RequestBody Compromisso compromisso) {

        return ResponseEntity.ok(compromissoService.atualizar(usuarioId, id, compromisso));
    }

    // DELETE /usuarios/{usuarioId}/compromissos/{id} — Exclui um compromisso
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long usuarioId,
            @PathVariable Long id) {

        compromissoService.excluir(usuarioId, id);
        return ResponseEntity.noContent().build();
    }
}
