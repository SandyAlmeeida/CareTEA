package com.caretea.service;

import com.caretea.dto.RelatorioGeralResponseDTO;
import com.caretea.dto.LembreteResponseDTO;
import com.caretea.model.Documento;
import com.caretea.model.Humor;
import com.caretea.model.Lembrete;
import com.caretea.model.RegistroBemEstar;
import com.caretea.model.TipoDocumento;
import com.caretea.model.TipoNotificacao;
import com.caretea.repository.DocumentoRepository;
import com.caretea.repository.LembreteRepository;
import com.caretea.repository.RegistroBemEstarRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.OptionalDouble;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class RelatorioService {

    private final DocumentoRepository documentoRepository;

    private final RegistroBemEstarRepository
            registroBemEstarRepository;

    private final LembreteRepository lembreteRepository;

    public RelatorioService(
            DocumentoRepository documentoRepository,
            RegistroBemEstarRepository registroBemEstarRepository,
            LembreteRepository lembreteRepository
    ) {
        this.documentoRepository = documentoRepository;
        this.registroBemEstarRepository =
                registroBemEstarRepository;
        this.lembreteRepository = lembreteRepository;
    }

    public RelatorioGeralResponseDTO gerar(
            Long usuarioId,
            Long pessoaAutistaId,
            LocalDate inicio,
            LocalDate fim
    ) {
        validar(
                usuarioId,
                pessoaAutistaId,
                inicio,
                fim
        );

        List<Documento> documentos =
                documentoRepository
                        .findByPessoaAutistaIdOrderByDataDocumentoDescCriadoEmDesc(
                                pessoaAutistaId
                        )
                        .stream()
                        .filter(documento ->
                                !documento
                                        .getDataDocumento()
                                        .isBefore(inicio)
                                        &&
                                        !documento
                                                .getDataDocumento()
                                                .isAfter(fim)
                        )
                        .toList();

        List<RegistroBemEstar> registros =
                registroBemEstarRepository
                        .findByUsuarioIdAndRegistradoEmBetweenOrderByRegistradoEmAsc(
                                usuarioId,
                                inicio.atStartOfDay(),
                                fim.atTime(LocalTime.MAX)
                        );

        LocalDateTime inicioPeriodo = inicio.atStartOfDay();
        LocalDateTime fimPeriodo = fim.atTime(LocalTime.MAX);

        List<Lembrete> lembretesNoPeriodo =
                lembreteRepository
                        .findByUsuarioIdOrderByDataHoraAsc(usuarioId)
                        .stream()
                        .filter(lembrete ->
                                !lembrete.getDataHora()
                                        .isBefore(inicioPeriodo)
                                        && !lembrete.getDataHora()
                                        .isAfter(fimPeriodo)
                        )
                        .toList();

        List<LembreteResponseDTO> lembretesMedicamento =
                converterLembretes(
                        lembretesNoPeriodo,
                        TipoNotificacao.MEDICAMENTO
                );
        List<LembreteResponseDTO> lembretesConsulta =
                converterLembretes(
                        lembretesNoPeriodo,
                        TipoNotificacao.CONSULTA
                );
        List<LembreteResponseDTO> lembretesExame =
                converterLembretes(
                        lembretesNoPeriodo,
                        TipoNotificacao.EXAME
                );

        RelatorioGeralResponseDTO.DocumentosResumo
                resumoDocumentos =
                criarResumoDocumentos(documentos);

        RelatorioGeralResponseDTO.BemEstarResumo
                resumoBemEstar =
                criarResumoBemEstar(registros);

        return new RelatorioGeralResponseDTO(
                usuarioId,
                pessoaAutistaId,
                inicio,
                fim,
                resumoDocumentos,
                resumoBemEstar,
                lembretesMedicamento,
                lembretesConsulta,
                lembretesExame
        );
    }

    private List<LembreteResponseDTO> converterLembretes(
            List<Lembrete> lembretes,
            TipoNotificacao tipo
    ) {
        return lembretes
                .stream()
                .filter(lembrete -> lembrete.getTipo() == tipo)
                .map(LembreteResponseDTO::new)
                .toList();
    }

    private RelatorioGeralResponseDTO.DocumentosResumo
    criarResumoDocumentos(
            List<Documento> documentos
    ) {
        return new RelatorioGeralResponseDTO.DocumentosResumo(
                documentos.size(),
                contarTipo(
                        documentos,
                        TipoDocumento.RECEITA
                ),
                contarTipo(
                        documentos,
                        TipoDocumento.LAUDO
                ),
                contarTipo(
                        documentos,
                        TipoDocumento.EXAME
                ),
                contarTipo(
                        documentos,
                        TipoDocumento.ATESTADO
                ),
                contarTipo(
                        documentos,
                        TipoDocumento.OUTRO
                )
        );
    }

    private long contarTipo(
            List<Documento> documentos,
            TipoDocumento tipo
    ) {
        return documentos
                .stream()
                .filter(documento ->
                        documento.getTipo() == tipo
                )
                .count();
    }

    private RelatorioGeralResponseDTO.BemEstarResumo
    criarResumoBemEstar(
            List<RegistroBemEstar> registros
    ) {
        return new RelatorioGeralResponseDTO.BemEstarResumo(
                registros.size(),
                humorMaisRegistrado(registros),
                mediaInteiros(
                        registros,
                        RegistroBemEstar::getAnsiedade
                ),
                mediaInteiros(
                        registros,
                        RegistroBemEstar::getEnergia
                ),
                mediaInteiros(
                        registros,
                        RegistroBemEstar::getQualidadeSono
                ),
                mediaDouble(
                        registros,
                        RegistroBemEstar::getHorasSono
                ),
                mediaInteiros(
                        registros,
                        RegistroBemEstar::getSobrecargaSensorial
                )
        );
    }

    private Humor humorMaisRegistrado(
            List<RegistroBemEstar> registros
    ) {
        Map<Humor, Long> contagem =
                registros
                        .stream()
                        .map(
                                RegistroBemEstar::getHumor
                        )
                        .filter(
                                Objects::nonNull
                        )
                        .collect(
                                Collectors.groupingBy(
                                        Function.identity(),
                                        Collectors.counting()
                                )
                        );

        return contagem
                .entrySet()
                .stream()
                .max(
                        Map.Entry.comparingByValue()
                )
                .map(
                        Map.Entry::getKey
                )
                .orElse(null);
    }

    private Double mediaInteiros(
            List<RegistroBemEstar> registros,
            Function<RegistroBemEstar, Integer> campo
    ) {
        OptionalDouble media =
                registros
                        .stream()
                        .map(campo)
                        .filter(
                                Objects::nonNull
                        )
                        .mapToInt(
                                Integer::intValue
                        )
                        .average();

        if (media.isEmpty()) {
            return null;
        }

        return arredondar(
                media.getAsDouble()
        );
    }

    private Double mediaDouble(
            List<RegistroBemEstar> registros,
            Function<RegistroBemEstar, Double> campo
    ) {
        OptionalDouble media =
                registros
                        .stream()
                        .map(campo)
                        .filter(
                                Objects::nonNull
                        )
                        .mapToDouble(
                                Double::doubleValue
                        )
                        .average();

        if (media.isEmpty()) {
            return null;
        }

        return arredondar(
                media.getAsDouble()
        );
    }

    private Double arredondar(
            double valor
    ) {
        return Math.round(
                valor * 100.0
        ) / 100.0;
    }

    private void validar(
            Long usuarioId,
            Long pessoaAutistaId,
            LocalDate inicio,
            LocalDate fim
    ) {
        if (
                usuarioId == null ||
                        pessoaAutistaId == null
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Usuário e perfil são obrigatórios."
            );
        }

        if (
                inicio == null ||
                        fim == null
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O período do relatório é obrigatório."
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
