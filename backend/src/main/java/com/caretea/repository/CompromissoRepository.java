package com.caretea.repository;

import com.caretea.model.Compromisso;
import com.caretea.model.TipoCompromisso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CompromissoRepository extends JpaRepository<Compromisso, Long> {

    // Busca de um compromisso garantindo que ele pertence ao usuário informado.
    Optional<Compromisso> findByIdAndUsuarioId(Long id, Long usuarioId);

    // Todos os compromissos do usuário (sem recorte de período).
    List<Compromisso> findByUsuarioIdOrderByDataAscHorarioInicioAsc(Long usuarioId);

    // Base para as buscas por dia, semana e mês: o service calcula o intervalo
    // [inicio, fim] e delega para este método, ordenando por data e horário.
    List<Compromisso> findByUsuarioIdAndDataBetweenOrderByDataAscHorarioInicioAsc(
            Long usuarioId, LocalDate inicio, LocalDate fim);

    // Mesmas buscas, porém filtrando por um tipo específico (ex.: só consultas).
    List<Compromisso> findByUsuarioIdAndTipoOrderByDataAscHorarioInicioAsc(
            Long usuarioId, TipoCompromisso tipo);

    List<Compromisso> findByUsuarioIdAndTipoAndDataBetweenOrderByDataAscHorarioInicioAsc(
            Long usuarioId, TipoCompromisso tipo, LocalDate inicio, LocalDate fim);
}
