package com.caretea.repository;

import com.caretea.model.HistoricoMedicamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HistoricoMedicamentoRepository extends JpaRepository<HistoricoMedicamento, Long> {
    Optional<HistoricoMedicamento> findByMedicamentoIdAndUsuarioIdAndDataReferencia(
            Long medicamentoId, Long usuarioId, LocalDate dataReferencia);

    List<HistoricoMedicamento> findTop20ByUsuarioIdOrderByTomadoEmDesc(Long usuarioId);

    void deleteByMedicamentoId(Long medicamentoId);
}
