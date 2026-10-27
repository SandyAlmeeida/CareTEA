package com.caretea.service;

import com.caretea.exception.RecursoNaoEncontradoException;
import com.caretea.model.HistoricoMedicamento;
import com.caretea.model.Medicamento;
import com.caretea.model.Usuario;
import com.caretea.repository.HistoricoMedicamentoRepository;
import com.caretea.repository.MedicamentoRepository;
import com.caretea.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MedicamentoService {

    private final MedicamentoRepository medicamentoRepository;
    private final HistoricoMedicamentoRepository historicoRepository;
    private final UsuarioRepository usuarioRepository;

    public MedicamentoService(MedicamentoRepository medicamentoRepository,
                              HistoricoMedicamentoRepository historicoRepository,
                              UsuarioRepository usuarioRepository) {
        this.medicamentoRepository = medicamentoRepository;
        this.historicoRepository = historicoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Medicamento> listar(Long usuarioId) {
        buscarUsuario(usuarioId);
        return medicamentoRepository.findByUsuarioIdOrderByHorarioAsc(usuarioId);
    }

    @Transactional
    public Medicamento criar(Long usuarioId, Medicamento medicamento) {
        Usuario usuario = buscarUsuario(usuarioId);
        validarTempos(medicamento);
        medicamento.setId(null);
        medicamento.setUsuario(usuario);
        return medicamentoRepository.save(medicamento);
    }

    @Transactional
    public Medicamento atualizar(Long usuarioId, Long id, Medicamento dados) {
        validarTempos(dados);
        Medicamento atual = buscarMedicamento(usuarioId, id);

        atual.setNome(dados.getNome());
        atual.setHorario(dados.getHorario());
        atual.setDose(dados.getDose());
        atual.setObservacoes(dados.getObservacoes());
        atual.setLembreteMinutos(dados.getLembreteMinutos());
        atual.setResponsavelMinutos(dados.getResponsavelMinutos());

        return medicamentoRepository.save(atual);
    }

    @Transactional
    public void excluir(Long usuarioId, Long id) {
        Medicamento medicamento = buscarMedicamento(usuarioId, id);
        historicoRepository.deleteByMedicamentoId(id);
        medicamentoRepository.delete(medicamento);
    }

    @Transactional
    public HistoricoMedicamento registrarTomado(Long usuarioId, Long medicamentoId) {
        Medicamento medicamento = buscarMedicamento(usuarioId, medicamentoId);
        LocalDate hoje = LocalDate.now();

        return historicoRepository
                .findByMedicamentoIdAndUsuarioIdAndDataReferencia(medicamentoId, usuarioId, hoje)
                .orElseGet(() -> historicoRepository.save(
                        new HistoricoMedicamento(medicamento, medicamento.getUsuario(), hoje, LocalDateTime.now())
                ));
    }

    public List<HistoricoMedicamento> listarHistorico(Long usuarioId) {
        buscarUsuario(usuarioId);
        return historicoRepository.findTop20ByUsuarioIdOrderByTomadoEmDesc(usuarioId);
    }

    private void validarTempos(Medicamento medicamento) {
        if (medicamento.getLembreteMinutos() != null
                && medicamento.getResponsavelMinutos() != null
                && medicamento.getResponsavelMinutos() <= medicamento.getLembreteMinutos()) {
            throw new IllegalArgumentException(
                    "O aviso ao responsável deve ocorrer depois do lembrete ao paciente.");
        }
    }

    private Medicamento buscarMedicamento(Long usuarioId, Long id) {
        return medicamentoRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Medicamento não encontrado para este usuário."));
    }

    private Usuario buscarUsuario(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));
    }
}
