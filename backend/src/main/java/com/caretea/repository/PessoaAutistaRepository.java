package com.caretea.repository;

import com.caretea.model.PessoaAutista;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PessoaAutistaRepository extends JpaRepository<PessoaAutista, Long> {

    List<PessoaAutista> findByUsuarioId(Long usuarioId);
}