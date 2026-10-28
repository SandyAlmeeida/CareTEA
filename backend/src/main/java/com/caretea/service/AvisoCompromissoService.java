package com.caretea.service;

import com.caretea.dto.AvisoCompromissoRequestDTO;
import com.caretea.dto.LembreteRequestDTO;
import com.caretea.dto.LembreteResponseDTO;
import com.caretea.model.TipoNotificacao;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AvisoCompromissoService {

    private final LembreteService lembreteService;

    public AvisoCompromissoService(
            LembreteService lembreteService
    ) {
        this.lembreteService = lembreteService;
    }

    public LembreteResponseDTO criarAviso(
            AvisoCompromissoRequestDTO dto
    ) {

        if (dto.getTipo() != TipoNotificacao.CONSULTA
                && dto.getTipo() != TipoNotificacao.EXAME) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O tipo deve ser CONSULTA ou EXAME"
            );
        }

        LembreteRequestDTO lembreteDTO =
                new LembreteRequestDTO();

        lembreteDTO.setUsuarioId(
                dto.getUsuarioId()
        );

        lembreteDTO.setTipo(
                dto.getTipo()
        );

        lembreteDTO.setNomeReferencia(
                dto.getDescricao()
        );

        lembreteDTO.setDetalheReferencia(
                null
        );

        lembreteDTO.setDataHora(
                dto.getDataHora()
        );

        if (dto.getTipo() == TipoNotificacao.CONSULTA) {

            lembreteDTO.setTitulo(
                    "Lembrete de consulta"
            );

            lembreteDTO.setMensagem(
                    "Há uma consulta agendada: "
                            + dto.getDescricao()
                            + "."
            );

        } else {

            lembreteDTO.setTitulo(
                    "Lembrete de exame"
            );

            lembreteDTO.setMensagem(
                    "Há um exame agendado: "
                            + dto.getDescricao()
                            + "."
            );
        }

        return lembreteService.criar(
                lembreteDTO
        );
    }
}