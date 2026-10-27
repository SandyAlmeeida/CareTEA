package com.caretea.repository;

import com.caretea.model.Lembrete;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LembreteRepository extends JpaRepository<Lembrete, Long> {

    List<Lembrete> findByUsuarioIdOrderByDataHoraAsc(Long usuarioId);

    List<Lembrete> findByAtivoTrueAndEnviadoFalseAndDataHoraLessThanEqual(
            LocalDateTime dataHora
    );
}