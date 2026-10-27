package com.caretea.repository;

import com.caretea.model.Documento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentoRepository extends JpaRepository<Documento, Long> {

    List<Documento> findByPessoaAutistaIdOrderByDataDocumentoDescCriadoEmDesc(
            Long pessoaAutistaId
    );
}