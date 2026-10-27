package com.caretea.repository;

import com.caretea.model.RegistroDoseMedicamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RegistroDoseMedicamentoRepository
        extends JpaRepository<RegistroDoseMedicamento, Long> {

    boolean existsByMedicamentoIdAndDataDose(
            Long medicamentoId,
            LocalDate dataDose
    );

    Optional<RegistroDoseMedicamento>
    findByMedicamentoIdAndDataDose(
            Long medicamentoId,
            LocalDate dataDose
    );

    List<RegistroDoseMedicamento>
    findByPessoaAutistaIdAndDataDoseOrderByConfirmadoEmAsc(
            Long pessoaAutistaId,
            LocalDate dataDose
    );

    List<RegistroDoseMedicamento>
    findByPessoaAutistaIdAndDataDoseBetweenOrderByDataDoseAscConfirmadoEmAsc(
            Long pessoaAutistaId,
            LocalDate inicio,
            LocalDate fim
    );
}