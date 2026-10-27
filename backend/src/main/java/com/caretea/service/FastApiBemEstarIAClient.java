package com.caretea.service;

import com.caretea.dto.AnaliseBemEstarIAResponseDTO;
import com.caretea.dto.ContextoBemEstarIADTO;
import com.caretea.dto.DashboardBemEstarResponseDTO;
import com.caretea.dto.EvolucaoBemEstarDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FastApiBemEstarIAClient
        implements BemEstarIAClient {

    private final RestClient restClient;

    public FastApiBemEstarIAClient(
            @Value(
                    "${caretea.ia.base-url:http://localhost:8000}"
            )
            String baseUrl
    ) {
        this.restClient =
                RestClient.builder()
                        .baseUrl(baseUrl)
                        .build();
    }

    @Override
    public AnaliseBemEstarIAResponseDTO gerarAnalise(
            DashboardBemEstarResponseDTO resumo,
            List<EvolucaoBemEstarDTO> evolucao,
            AnaliseBemEstarIAResponseDTO analiseBase
    ) {

        ContextoBemEstarIADTO contexto =
                new ContextoBemEstarIADTO(
                        resumo,
                        evolucao,
                        analiseBase
                );

        AnaliseBemEstarIAResponseDTO respostaIA =
                restClient.post()
                        .uri("/analisar-bem-estar")
                        .body(contexto)
                        .retrieve()
                        .body(
                                AnaliseBemEstarIAResponseDTO.class
                        );

        if (respostaIA == null) {
            throw new IllegalStateException(
                    "O serviço de IA não retornou uma resposta."
            );
        }

        respostaIA.setUsuarioId(
                analiseBase.getUsuarioId()
        );

        respostaIA.setTendenciaHumor(
                analiseBase.getTendenciaHumor()
        );

        respostaIA.setTendenciaAnsiedade(
                analiseBase.getTendenciaAnsiedade()
        );

        respostaIA.setTendenciaEnergia(
                analiseBase.getTendenciaEnergia()
        );

        respostaIA.setTendenciaSono(
                analiseBase.getTendenciaSono()
        );

        respostaIA.setTendenciaSobrecargaSensorial(
                analiseBase
                        .getTendenciaSobrecargaSensorial()
        );

        respostaIA.setObservacaoSeguranca(
                "Esta análise é informativa e não substitui avaliação profissional."
        );

        respostaIA.setGeradoEm(
                LocalDateTime.now()
        );

        return respostaIA;
    }
}