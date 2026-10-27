package com.caretea.service;

import com.caretea.dto.AvisoMedicamentoRequestDTO;
import com.caretea.dto.LembreteRequestDTO;
import com.caretea.dto.LembreteResponseDTO;
import com.caretea.model.TipoNotificacao;
import org.springframework.stereotype.Service;

@Service
public class AvisoMedicamentoService {

    private final LembreteService lembreteService;

    public AvisoMedicamentoService(
            LembreteService lembreteService
    ) {
        this.lembreteService = lembreteService;
    }

    public LembreteResponseDTO criarAviso(
            AvisoMedicamentoRequestDTO dto
    ) {

        LembreteRequestDTO lembreteDTO =
                new LembreteRequestDTO();

        lembreteDTO.setUsuarioId(
                dto.getUsuarioId()
        );

        lembreteDTO.setTipo(
                TipoNotificacao.MEDICAMENTO
        );

        lembreteDTO.setTitulo(
                "Hora do medicamento"
        );

        lembreteDTO.setMensagem(
                "Está na hora do medicamento "
                        + dto.getNomeMedicamento()
                        + " ("
                        + dto.getDosagem()
                        + ")."
        );

        lembreteDTO.setDataHora(
                dto.getDataHora()
        );

        lembreteDTO.setNomeReferencia(
                dto.getNomeMedicamento()
        );

        lembreteDTO.setDetalheReferencia(
                dto.getDosagem()
        );

        return lembreteService.criar(
                lembreteDTO
        );
    }
}