package com.caretea.repository;

import com.caretea.model.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MedicamentoRepository extends JpaRepository<Medicamento, Long> {
    List<Medicamento> findByUsuarioIdOrderByHorarioAsc(Long usuarioId);
    Optional<Medicamento> findByIdAndUsuarioId(Long id, Long usuarioId);
}
