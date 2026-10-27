package com.caretea.repository;

import com.caretea.model.AcessoMeuDia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AcessoMeuDiaRepository
        extends JpaRepository<AcessoMeuDia, Long> {

    Optional<AcessoMeuDia>
    findFirstByPessoaAutistaIdAndAtivoTrueOrderByCriadoEmDesc(
            Long pessoaAutistaId
    );

    Optional<AcessoMeuDia>
    findByCodigoHashAndAtivoTrue(
            String codigoHash
    );

    Optional<AcessoMeuDia>
    findByTokenHashAndAtivoTrue(
            String tokenHash
    );

    boolean existsByCodigoHash(
            String codigoHash
    );

    List<AcessoMeuDia>
    findByPessoaAutistaIdOrderByCriadoEmDesc(
            Long pessoaAutistaId
    );
}