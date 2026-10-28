package com.caretea.service;

import com.caretea.dto.EvolucaoBemEstarDTO;
import com.caretea.model.Humor;
import com.caretea.model.RegistroBemEstar;
import com.caretea.repository.RegistroBemEstarRepository;
import com.caretea.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class EvolucaoBemEstarService {

    private final RegistroBemEstarRepository registroBemEstarRepository;
    private final UsuarioRepository usuarioRepository;

    public EvolucaoBemEstarService(
            RegistroBemEstarRepository registroBemEstarRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.registroBemEstarRepository =
                registroBemEstarRepository;

        this.usuarioRepository =
                usuarioRepository;
    }

    public List<EvolucaoBemEstarDTO> buscarEvolucao(
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

        /*
         * Agrupa os registros por dia.
         */
        Map<LocalDate, List<RegistroBemEstar>> registrosPorDia =
                new LinkedHashMap<>();

        for (RegistroBemEstar registro : registros) {

            LocalDate data =
                    registro
                            .getRegistradoEm()
                            .toLocalDate();

            registrosPorDia
                    .computeIfAbsent(
                            data,
                            chave -> new ArrayList<>()
                    )
                    .add(
                            registro
                    );
        }

        List<EvolucaoBemEstarDTO> resultado =
                new ArrayList<>();

        for (
                Map.Entry<LocalDate, List<RegistroBemEstar>> item
                : registrosPorDia.entrySet()
        ) {

            LocalDate data =
                    item.getKey();

            List<RegistroBemEstar> registrosDia =
                    item.getValue();

            EvolucaoBemEstarDTO dto =
                    criarResumoDoDia(
                            data,
                            registrosDia
                    );

            resultado.add(
                    dto
            );
        }

        return resultado;
    }

    private EvolucaoBemEstarDTO criarResumoDoDia(
            LocalDate data,
            List<RegistroBemEstar> registros
    ) {

        EvolucaoBemEstarDTO dto =
                new EvolucaoBemEstarDTO();

        dto.setData(
                data
        );

        dto.setTotalRegistros(
                (long) registros.size()
        );

        dto.setMediaHumor(
                arredondar(
                        registros.stream()
                                .mapToInt(registro ->
                                        converterHumorParaNumero(
                                                registro.getHumor()
                                        )
                                )
                                .average()
                                .orElse(0)
                )
        );

        dto.setHumorPredominante(
                calcularHumorPredominante(
                        registros
                )
        );

        dto.setMediaAnsiedade(
                arredondar(
                        registros.stream()
                                .mapToInt(
                                        RegistroBemEstar::getAnsiedade
                                )
                                .average()
                                .orElse(0)
                )
        );

        dto.setMediaEnergia(
                arredondar(
                        registros.stream()
                                .mapToInt(
                                        RegistroBemEstar::getEnergia
                                )
                                .average()
                                .orElse(0)
                )
        );

        dto.setMediaQualidadeSono(
                arredondar(
                        registros.stream()
                                .mapToInt(
                                        RegistroBemEstar::getQualidadeSono
                                )
                                .average()
                                .orElse(0)
                )
        );

        dto.setMediaSobrecargaSensorial(
                arredondar(
                        registros.stream()
                                .mapToInt(
                                        RegistroBemEstar::getSobrecargaSensorial
                                )
                                .average()
                                .orElse(0)
                )
        );

        double mediaHorasSono =
                registros.stream()
                        .map(
                                RegistroBemEstar::getHorasSono
                        )
                        .filter(
                                valor -> valor != null
                        )
                        .mapToDouble(
                                Double::doubleValue
                        )
                        .average()
                        .orElse(
                                Double.NaN
                        );

        if (Double.isNaN(
                mediaHorasSono
        )) {

            dto.setMediaHorasSono(
                    null
            );

        } else {

            dto.setMediaHorasSono(
                    arredondar(
                            mediaHorasSono
                    )
            );
        }

        return dto;
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

        for (
                Map.Entry<Humor, Integer> item
                : contagem.entrySet()
        ) {

            if (item.getValue()
                    > maiorQuantidade) {

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

        if (inicio == null
                || fim == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "As datas de início e fim são obrigatórias."
            );
        }

        if (inicio.isAfter(
                fim
        )) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A data inicial não pode ser posterior à data final."
            );
        }
    }
}