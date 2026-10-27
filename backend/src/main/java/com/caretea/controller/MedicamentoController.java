package com.caretea.controller;

import com.caretea.model.HistoricoMedicamento;
import com.caretea.model.Medicamento;
import com.caretea.service.MedicamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios/{usuarioId}/medicamentos")
public class MedicamentoController {

    private final MedicamentoService medicamentoService;

    public MedicamentoController(MedicamentoService medicamentoService) {
        this.medicamentoService = medicamentoService;
    }

    @GetMapping
    public ResponseEntity<List<Medicamento>> listar(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(medicamentoService.listar(usuarioId));
    }

    @PostMapping
    public ResponseEntity<Medicamento> criar(
            @PathVariable Long usuarioId,
            @Valid @RequestBody Medicamento medicamento) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(medicamentoService.criar(usuarioId, medicamento));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicamento> atualizar(
            @PathVariable Long usuarioId,
            @PathVariable Long id,
            @Valid @RequestBody Medicamento medicamento) {
        return ResponseEntity.ok(medicamentoService.atualizar(usuarioId, id, medicamento));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long usuarioId,
            @PathVariable Long id) {
        medicamentoService.excluir(usuarioId, id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/tomado")
    public ResponseEntity<HistoricoMedicamento> registrarTomado(
            @PathVariable Long usuarioId,
            @PathVariable Long id) {
        return ResponseEntity.ok(medicamentoService.registrarTomado(usuarioId, id));
    }

    @GetMapping("/historico")
    public ResponseEntity<List<HistoricoMedicamento>> listarHistorico(
            @PathVariable Long usuarioId) {
        return ResponseEntity.ok(medicamentoService.listarHistorico(usuarioId));
    }
}
