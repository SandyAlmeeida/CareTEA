package com.caretea.service;

import com.caretea.dto.DashboardBemEstarResponseDTO;
import com.caretea.model.Humor;
import com.caretea.model.RegistroBemEstar;
import com.caretea.repository.RegistroBemEstarRepository;
import com.caretea.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardBemEstarService {

    private final RegistroBemEstarRepository registroBemEstarRepository;
    private final UsuarioRepository usuarioRepository;

    public DashboardBemEstarService(
            RegistroBemEstarRepository registroBemEstarRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.registroBemEstarRepository =
                registroBemEstarRepository;

        this.usuarioRepository =
                usuarioRepository;
    }

    public DashboardBemEstarResponseDTO gerarResumo(
            Long usuarioId,
            LocalDateTime inicio,
            LocalDateTime fim
    ) {

        validarDados(
                usuarioId,
                inicio,
                fim
        );

        List<RegistroBemEstar> registros =
                registroBemEstarRepository
                        .findByUsuarioIdAndRegistradoEmBetweenOrderByRegistradoEmAsc(
                                usuarioId,
                                inicio,
                                fim
                        );

        DashboardBemEstarResponseDTO resposta =
                new DashboardBemEstarResponseDTO();

        resposta.setUsuarioId(
                usuarioId
        );

        resposta.setInicio(
                inicio
        );

        resposta.setFim(
                fim
        );

        resposta.setTotalRegistros(
                (long) registros.size()
        );

        /*
         * Caso ainda não existam registros
         * no período solicitado.
         */
        if (registros.isEmpty()) {

            resposta.setMediaHumor(
                    null
            );

            resposta.setHumorPredominante(
                    null
            );

            resposta.setMediaAnsiedade(
                    null
            );

            resposta.setMediaEnergia(
                    null
            );

            resposta.setMediaQualidadeSono(
                    null
            );

            resposta.setMediaHorasSono(
                    null
            );

            resposta.setMediaSobrecargaSensorial(
                    null
            );

            return resposta;
        }

        resposta.setMediaHumor(
                arredondar(
                        calcularMediaHumor(
                                registros
                        )
                )
        );

        resposta.setHumorPredominante(
                calcularHumorPredominante(
                        registros
                )
        );

        resposta.setMediaAnsiedade(
                arredondar(
                        registros.stream()
                                .mapToInt(
                                        RegistroBemEstar::getAnsiedade
                                )
                                .average()
                                .orElse(0)
                )
        );

        resposta.setMediaEnergia(
                arredondar(
                        registros.stream()
                                .mapToInt(
                                        RegistroBemEstar::getEnergia
                                )
                                .average()
                                .orElse(0)
                )
        );

        resposta.setMediaQualidadeSono(
                arredondar(
                        registros.stream()
                                .mapToInt(
                                        RegistroBemEstar::getQualidadeSono
                                )
                                .average()
                                .orElse(0)
                )
        );

        resposta.setMediaSobrecargaSensorial(
                arredondar(
                        registros.stream()
                                .mapToInt(
                                        RegistroBemEstar::getSobrecargaSensorial
                                )
                                .average()
                                .orElse(0)
                )
        );

        /*
         * Horas de sono podem ser nulas,
         * por isso filtramos antes da média.
         */
        double mediaHorasSono =
                registros.stream()
                        .map(RegistroBemEstar::getHorasSono)
                        .filter(valor -> valor != null)
                        .mapToDouble(Double::doubleValue)
                        .average()
                        .orElse(Double.NaN);

        if (Double.isNaN(mediaHorasSono)) {

            resposta.setMediaHorasSono(
                    null
            );

        } else {

            resposta.setMediaHorasSono(
                    arredondar(
                            mediaHorasSono
                    )
            );
        }

        return resposta;
    }

    private double calcularMediaHumor(
            List<RegistroBemEstar> registros
    ) {

        return registros.stream()
                .mapToInt(registro ->
                        converterHumorParaNumero(
                                registro.getHumor()
                        )
                )
                .average()
                .orElse(0);
    }

    private Humor calcularHumorPredominante(
            List<RegistroBemEstar> registros
    ) {

        Map<Humor, Integer> contagem =
                new EnumMap<>(
                        Humor.class
                );

        for (RegistroBemEstar registro : registros) {

            Humor humor =
                    registro.getHumor();

            contagem.put(
                    humor,
                    contagem.getOrDefault(
                            humor,
                            0
                    ) + 1
            );
        }

        Humor predominante =
                null;

        int maiorQuantidade =
                -1;

        for (Map.Entry<Humor, Integer> item
                : contagem.entrySet()) {

            if (item.getValue() > maiorQuantidade) {

                maiorQuantidade =
                        item.getValue();

                predominante =
                        item.getKey();
            }
        }

        return predominante;
    }

    private int converterHumorParaNumero(
            Humor humor
    ) {

        return switch (humor) {

            case MUITO_MAL ->
                    1;

            case MAL ->
                    2;

            case NEUTRO ->
                    3;

            case BEM ->
                    4;

            case MUITO_BEM ->
                    5;
        };
    }

    private double arredondar(
            double valor
    ) {

        return Math.round(
                valor * 10.0
        ) / 10.0;
    }

    private void validarDados(
            Long usuarioId,
            LocalDateTime inicio,
            LocalDateTime fim
    ) {

        if (usuarioId == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O usuário é obrigatório."
            );
        }

        if (!usuarioRepository.existsById(
                usuarioId
        )) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Usuário não encontrado."
            );
        }

        if (inicio == null || fim == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "As datas de início e fim são obrigatórias."
            );
        }

        if (inicio.isAfter(fim)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A data inicial não pode ser posterior à data final."
            );
        }
    }
}