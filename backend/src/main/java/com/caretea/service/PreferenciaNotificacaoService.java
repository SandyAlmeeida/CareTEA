package com.caretea.service;

import com.caretea.dto.PreferenciaNotificacaoDTO;
import com.caretea.model.PreferenciaNotificacao;
import com.caretea.model.Usuario;
import com.caretea.repository.PreferenciaNotificacaoRepository;
import com.caretea.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PreferenciaNotificacaoService {

    private final PreferenciaNotificacaoRepository preferenciaRepository;
    private final UsuarioRepository usuarioRepository;

    public PreferenciaNotificacaoService(
            PreferenciaNotificacaoRepository preferenciaRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.preferenciaRepository = preferenciaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public PreferenciaNotificacaoDTO buscarPorUsuario(
            Long usuarioId
    ) {

        PreferenciaNotificacao preferencia =
                preferenciaRepository
                        .findByUsuarioId(usuarioId)
                        .orElseGet(() ->
                                criarPreferenciaPadrao(
                                        usuarioId
                                )
                        );

        return new PreferenciaNotificacaoDTO(
                preferencia
        );
    }

    public PreferenciaNotificacaoDTO atualizar(
            Long usuarioId,
            PreferenciaNotificacaoDTO dto
    ) {

        PreferenciaNotificacao preferencia =
                preferenciaRepository
                        .findByUsuarioId(usuarioId)
                        .orElseGet(() ->
                                criarPreferenciaPadrao(
                                        usuarioId
                                )
                        );

        preferencia.setWhatsappAtivo(
                dto.isWhatsappAtivo()
        );

        preferencia.setMedicamentoAtivo(
                dto.isMedicamentoAtivo()
        );

        preferencia.setConsultaAtivo(
                dto.isConsultaAtivo()
        );

        preferencia.setExameAtivo(
                dto.isExameAtivo()
        );

        preferencia.setLembreteAtivo(
                dto.isLembreteAtivo()
        );

        preferencia.setEnviarParaResponsavel(
                dto.isEnviarParaResponsavel()
        );

        preferencia.setEnviarParaAutista(
                dto.isEnviarParaAutista()
        );

        PreferenciaNotificacao salva =
                preferenciaRepository.save(
                        preferencia
                );

        return new PreferenciaNotificacaoDTO(
                salva
        );
    }

    private PreferenciaNotificacao criarPreferenciaPadrao(
            Long usuarioId
    ) {

        Usuario usuario =
                usuarioRepository
                        .findById(usuarioId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Usuário não encontrado"
                                )
                        );

        PreferenciaNotificacao preferencia =
                new PreferenciaNotificacao();

        preferencia.setUsuario(
                usuario
        );

        preferencia.setWhatsappAtivo(
                true
        );

        preferencia.setMedicamentoAtivo(
                true
        );

        preferencia.setConsultaAtivo(
                true
        );

        preferencia.setExameAtivo(
                true
        );

        preferencia.setLembreteAtivo(
                true
        );

        preferencia.setEnviarParaResponsavel(
                true
        );

        preferencia.setEnviarParaAutista(
                true
        );

        return preferenciaRepository.save(
                preferencia
        );
    }
}