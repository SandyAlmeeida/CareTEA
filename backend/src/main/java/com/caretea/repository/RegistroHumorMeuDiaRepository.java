package com.caretea.repository;

import com.caretea.model.RegistroHumorMeuDia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RegistroHumorMeuDiaRepository
        extends JpaRepository<RegistroHumorMeuDia, Long> {

    Optional<RegistroHumorMeuDia>
    findByPessoaAutistaIdAndDataRegistro(
            Long pessoaAutistaId,
            LocalDate dataRegistro
    );

    List<RegistroHumorMeuDia>
    findByPessoaAutistaIdAndDataRegistroBetweenOrderByDataRegistroAsc(
            Long pessoaAutistaId,
            LocalDate inicio,
            LocalDate fim
    );
}