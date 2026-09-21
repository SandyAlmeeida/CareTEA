package com.caretea.service;

import com.caretea.exception.RecursoNaoEncontradoException;
import com.caretea.model.Compromisso;
import com.caretea.model.TipoCompromisso;
import com.caretea.model.Usuario;
import com.caretea.repository.CompromissoRepository;
import com.caretea.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

/**
 * Regras de negócio da agenda: cria, edita, exclui e busca compromissos
 * (consultas, exames, terapias e outros) por dia, semana ou mês, com filtro
 * opcional por tipo.
 */
@Service
public class CompromissoService {

    private final CompromissoRepository compromissoRepository;
    private final UsuarioRepository usuarioRepository;

    public CompromissoService(CompromissoRepository compromissoRepository,
                              UsuarioRepository usuarioRepository) {
        this.compromissoRepository = compromissoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Compromisso criar(Long usuarioId, Compromisso compromisso) {
        Usuario usuario = buscarUsuario(usuarioId);
        compromisso.setId(null);
        compromisso.setUsuario(usuario);
        return compromissoRepository.save(compromisso);
    }

    @Transactional
    public Compromisso atualizar(Long usuarioId, Long id, Compromisso dados) {
        Compromisso atual = buscarPorId(usuarioId, id);

        atual.setTipo(dados.getTipo());
        atual.setTitulo(dados.getTitulo());
        atual.setEspecialidade(dados.getEspecialidade());
        atual.setData(dados.getData());
        atual.setHorarioInicio(dados.getHorarioInicio());
        atual.setHorarioFim(dados.getHorarioFim());
        atual.setLocal(dados.getLocal());
        atual.setObservacoes(dados.getObservacoes());
        atual.setLembrete(dados.isLembrete());

        return compromissoRepository.save(atual);
    }

    @Transactional
    public void excluir(Long usuarioId, Long id) {
        Compromisso compromisso = buscarPorId(usuarioId, id);
        compromissoRepository.delete(compromisso);
    }

    public Compromisso buscarPorId(Long usuarioId, Long id) {
        return compromissoRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Compromisso não encontrado para este usuário."));
    }

    // Lista todos (opcionalmente filtrando por tipo).
    public List<Compromisso> listar(Long usuarioId, String tipo) {
        TipoCompromisso tipoFiltro = converterTipo(tipo);

        if (tipoFiltro != null) {
            return compromissoRepository
                    .findByUsuarioIdAndTipoOrderByDataAscHorarioInicioAsc(usuarioId, tipoFiltro);
        }

        return compromissoRepository
                .findByUsuarioIdOrderByDataAscHorarioInicioAsc(usuarioId);
    }

    /**
     * Busca por período. {@code periodo} aceita "dia", "semana" ou "mes";
     * {@code referencia} é a data base (padrão: hoje); {@code tipo} é opcional.
     * A semana é calculada de segunda a domingo, alinhada ao front.
     */
    public List<Compromisso> listarPorPeriodo(Long usuarioId, String periodo,
                                              LocalDate referencia, String tipo) {
        LocalDate base = (referencia != null) ? referencia : LocalDate.now();
        String p = (periodo != null) ? periodo.trim().toLowerCase() : "dia";

        LocalDate inicio;
        LocalDate fim;

        switch (p) {
            case "dia" -> {
                inicio = base;
                fim = base;
            }
            case "semana" -> {
                inicio = base.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
                fim = base.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
            }
            case "mes" -> {
                inicio = base.withDayOfMonth(1);
                fim = base.with(TemporalAdjusters.lastDayOfMonth());
            }
            default -> throw new IllegalArgumentException(
                    "Período inválido: " + periodo + ". Use dia, semana ou mes.");
        }

        return listarPorIntervalo(usuarioId, inicio, fim, tipo);
    }

    public List<Compromisso> listarPorIntervalo(Long usuarioId, LocalDate inicio,
                                                LocalDate fim, String tipo) {
        if (inicio == null || fim == null) {
            throw new IllegalArgumentException("Datas de início e fim são obrigatórias.");
        }

        if (fim.isBefore(inicio)) {
            throw new IllegalArgumentException("A data final não pode ser anterior à inicial.");
        }

        TipoCompromisso tipoFiltro = converterTipo(tipo);

        if (tipoFiltro != null) {
            return compromissoRepository
                    .findByUsuarioIdAndTipoAndDataBetweenOrderByDataAscHorarioInicioAsc(
                            usuarioId, tipoFiltro, inicio, fim);
        }

        return compromissoRepository
                .findByUsuarioIdAndDataBetweenOrderByDataAscHorarioInicioAsc(usuarioId, inicio, fim);
    }

    private TipoCompromisso converterTipo(String tipo) {
        if (tipo == null || tipo.isBlank()) {
            return null;
        }
        return TipoCompromisso.fromJson(tipo);
    }

    private Usuario buscarUsuario(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Usuário não encontrado."));
    }
}
