package com.caretea.repository;

import com.caretea.model.PedidoAjudaMeuDia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoAjudaMeuDiaRepository
        extends JpaRepository<PedidoAjudaMeuDia, Long> {

    List<PedidoAjudaMeuDia>
    findByPessoaAutistaIdOrderBySolicitadoEmDesc(
            Long pessoaAutistaId
    );

    List<PedidoAjudaMeuDia>
    findByPessoaAutistaIdAndAtendidoFalseOrderBySolicitadoEmDesc(
            Long pessoaAutistaId
    );
}