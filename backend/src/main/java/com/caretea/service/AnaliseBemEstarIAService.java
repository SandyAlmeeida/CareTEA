package com.caretea.service;

import com.caretea.dto.AnaliseBemEstarIAResponseDTO;
import com.caretea.dto.DashboardBemEstarResponseDTO;
import com.caretea.dto.EvolucaoBemEstarDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

@Service
public class AnaliseBemEstarIAService {

    private final DashboardBemEstarService dashboardBemEstarService;
    private final EvolucaoBemEstarService evolucaoBemEstarService;
    private final BemEstarIAClient bemEstarIAClient;

    public AnaliseBemEstarIAService(
            DashboardBemEstarService dashboardBemEstarService,
            EvolucaoBemEstarService evolucaoBemEstarService,
            BemEstarIAClient bemEstarIAClient
    ) {
        this.dashboardBemEstarService =
                dashboardBemEstarService;

        this.evolucaoBemEstarService =
                evolucaoBemEstarService;

        this.bemEstarIAClient =
                bemEstarIAClient;
    }

    public AnaliseBemEstarIAResponseDTO analisar(
            Long usuarioId,
            LocalDateTime inicio,
            LocalDateTime fim
    ) {

        DashboardBemEstarResponseDTO resumo =
                dashboardBemEstarService
                        .gerarResumo(
                                usuarioId,
                                inicio,
                                fim
                        );

        List<EvolucaoBemEstarDTO> evolucao =
                evolucaoBemEstarService
                        .buscarEvolucao(
                                usuarioId,
                                inicio,
                                fim
                        );

        AnaliseBemEstarIAResponseDTO analiseBase =
                criarAnaliseBase(
                        usuarioId,
                        resumo,
                        evolucao
                );

        if (resumo.getTotalRegistros() == null
                || resumo.getTotalRegistros() == 0) {

            return analiseBase;
        }

        try {

            return bemEstarIAClient
                    .gerarAnalise(
                            resumo,
                            evolucao,
                            analiseBase
                    );

        } catch (Exception erro) {

            System.err.println(
                    "Erro ao acessar serviço de IA: "
                            + erro.getMessage()
            );

            return analiseBase;
        }
    }

    private AnaliseBemEstarIAResponseDTO criarAnaliseBase(
            Long usuarioId,
            DashboardBemEstarResponseDTO resumo,
            List<EvolucaoBemEstarDTO> evolucao
    ) {

        AnaliseBemEstarIAResponseDTO resposta =
                new AnaliseBemEstarIAResponseDTO();

        resposta.setUsuarioId(
                usuarioId
        );

        resposta.setGeradoEm(
                LocalDateTime.now()
        );

        resposta.setObservacaoSeguranca(
                "Esta análise é informativa e não substitui avaliação profissional."
        );

        if (resumo.getTotalRegistros() == null
                || resumo.getTotalRegistros() == 0) {

            resposta.setResumo(
                    "Ainda não há registros de bem-estar suficientes para gerar uma análise."
            );

            resposta.setTendenciaHumor(
                    "DADOS_INSUFICIENTES"
            );

            resposta.setTendenciaAnsiedade(
                    "DADOS_INSUFICIENTES"
            );

            resposta.setTendenciaEnergia(
                    "DADOS_INSUFICIENTES"
            );

            resposta.setTendenciaSono(
                    "DADOS_INSUFICIENTES"
            );

            resposta.setTendenciaSobrecargaSensorial(
                    "DADOS_INSUFICIENTES"
            );

            resposta.setPontosPositivos(
                    new ArrayList<>()
            );

            resposta.setPontosAtencao(
                    new ArrayList<>()
            );

            resposta.setRecomendacoes(
                    List.of(
                            "Continue registrando o bem-estar para que a Care possa identificar padrões ao longo do tempo."
                    )
            );

            return resposta;
        }

        resposta.setTendenciaHumor(
                calcularTendencia(
                        evolucao,
                        EvolucaoBemEstarDTO::getMediaHumor,
                        true
                )
        );

        resposta.setTendenciaAnsiedade(
                calcularTendencia(
                        evolucao,
                        EvolucaoBemEstarDTO::getMediaAnsiedade,
                        false
                )
        );

        resposta.setTendenciaEnergia(
                calcularTendencia(
                        evolucao,
                        EvolucaoBemEstarDTO::getMediaEnergia,
                        true
                )
        );

        resposta.setTendenciaSono(
                calcularTendencia(
                        evolucao,
                        EvolucaoBemEstarDTO::getMediaQualidadeSono,
                        true
                )
        );

        resposta.setTendenciaSobrecargaSensorial(
                calcularTendencia(
                        evolucao,
                        EvolucaoBemEstarDTO::getMediaSobrecargaSensorial,
                        false
                )
        );

        resposta.setPontosPositivos(
                gerarPontosPositivos(
                        resumo
                )
        );

        resposta.setPontosAtencao(
                gerarPontosAtencao(
                        resumo
                )
        );

        resposta.setRecomendacoes(
                gerarRecomendacoes(
                        resumo
                )
        );

        resposta.setResumo(
                gerarResumoTexto(
                        resumo,
                        resposta
                )
        );

        return resposta;
    }

    private String calcularTendencia(
            List<EvolucaoBemEstarDTO> evolucao,
            Function<EvolucaoBemEstarDTO, Double> extrator,
            boolean valorMaiorEhMelhor
    ) {

        if (evolucao.size() < 2) {
            return "DADOS_INSUFICIENTES";
        }

        int metade =
                evolucao.size() / 2;

        if (metade == 0) {
            return "DADOS_INSUFICIENTES";
        }

        List<EvolucaoBemEstarDTO> primeiraParte =
                evolucao.subList(
                        0,
                        metade
                );

        List<EvolucaoBemEstarDTO> segundaParte =
                evolucao.subList(
                        metade,
                        evolucao.size()
                );

        Double mediaInicial =
                calcularMedia(
                        primeiraParte,
                        extrator
                );

        Double mediaFinal =
                calcularMedia(
                        segundaParte,
                        extrator
                );

        if (mediaInicial == null
                || mediaFinal == null) {

            return "DADOS_INSUFICIENTES";
        }

        double diferenca =
                mediaFinal - mediaInicial;

        if (Math.abs(diferenca) < 0.5) {
            return "ESTAVEL";
        }

        if (valorMaiorEhMelhor) {

            if (diferenca > 0) {
                return "MELHORA";
            }

            return "PIORA";
        }

        if (diferenca < 0) {
            return "MELHORA";
        }

        return "PIORA";
    }

    private Double calcularMedia(
            List<EvolucaoBemEstarDTO> registros,
            Function<EvolucaoBemEstarDTO, Double> extrator
    ) {

        double soma =
                0;

        int quantidade =
                0;

        for (EvolucaoBemEstarDTO registro : registros) {

            Double valor =
                    extrator.apply(
                            registro
                    );

            if (valor != null) {

                soma += valor;
                quantidade++;
            }
        }

        if (quantidade == 0) {
            return null;
        }

        return soma / quantidade;
    }

    private List<String> gerarPontosPositivos(
            DashboardBemEstarResponseDTO resumo
    ) {

        List<String> pontos =
                new ArrayList<>();

        if (resumo.getMediaHumor() != null
                && resumo.getMediaHumor() >= 4) {

            pontos.add(
                    "O humor apresentou uma média positiva no período."
            );
        }

        if (resumo.getMediaAnsiedade() != null
                && resumo.getMediaAnsiedade() <= 3) {

            pontos.add(
                    "Os registros indicam baixos níveis médios de ansiedade."
            );
        }

        if (resumo.getMediaEnergia() != null
                && resumo.getMediaEnergia() >= 7) {

            pontos.add(
                    "A energia apresentou uma média elevada no período."
            );
        }

        if (resumo.getMediaQualidadeSono() != null
                && resumo.getMediaQualidadeSono() >= 7) {

            pontos.add(
                    "A qualidade do sono apresentou bons resultados."
            );
        }

        if (resumo.getMediaSobrecargaSensorial() != null
                && resumo.getMediaSobrecargaSensorial() <= 3) {

            pontos.add(
                    "A sobrecarga sensorial permaneceu baixa na média."
            );
        }

        return pontos;
    }

    private List<String> gerarPontosAtencao(
            DashboardBemEstarResponseDTO resumo
    ) {

        List<String> pontos =
                new ArrayList<>();

        if (resumo.getMediaHumor() != null
                && resumo.getMediaHumor() <= 2) {

            pontos.add(
                    "O humor apresentou valores baixos no período."
            );
        }

        if (resumo.getMediaAnsiedade() != null
                && resumo.getMediaAnsiedade() >= 7) {

            pontos.add(
                    "Os registros mostram níveis elevados de ansiedade."
            );
        }

        if (resumo.getMediaEnergia() != null
                && resumo.getMediaEnergia() <= 4) {

            pontos.add(
                    "A energia apresentou valores baixos."
            );
        }

        if (resumo.getMediaQualidadeSono() != null
                && resumo.getMediaQualidadeSono() <= 4) {

            pontos.add(
                    "A qualidade do sono apresentou valores baixos."
            );
        }

        if (resumo.getMediaSobrecargaSensorial() != null
                && resumo.getMediaSobrecargaSensorial() >= 7) {

            pontos.add(
                    "A sobrecarga sensorial apresentou valores elevados."
            );
        }

        return pontos;
    }

    private List<String> gerarRecomendacoes(
            DashboardBemEstarResponseDTO resumo
    ) {

        List<String> recomendacoes =
                new ArrayList<>();

        if (resumo.getMediaAnsiedade() != null
                && resumo.getMediaAnsiedade() >= 6) {

            recomendacoes.add(
                    "Considere reservar momentos de pausa e utilizar estratégias de relaxamento que já funcionem bem na rotina."
            );
        }

        if (resumo.getMediaQualidadeSono() != null
                && resumo.getMediaQualidadeSono() <= 5) {

            recomendacoes.add(
                    "Tente manter horários mais regulares para dormir e acordar."
            );
        }

        if (resumo.getMediaHorasSono() != null
                && resumo.getMediaHorasSono() < 6) {

            recomendacoes.add(
                    "Observe se existe espaço na rotina para aumentar o tempo de descanso."
            );
        }

        if (resumo.getMediaEnergia() != null
                && resumo.getMediaEnergia() <= 4) {

            recomendacoes.add(
                    "Observe quais atividades parecem aumentar ou reduzir sua energia ao longo do dia."
            );
        }

        if (resumo.getMediaSobrecargaSensorial() != null
                && resumo.getMediaSobrecargaSensorial() >= 6) {

            recomendacoes.add(
                    "Identifique ambientes ou situações associados à sobrecarga sensorial e planeje pausas quando possível."
            );
        }

        recomendacoes.add(
                "Continue registrando seu bem-estar para acompanhar mudanças ao longo do tempo."
        );

        return recomendacoes;
    }

    private String gerarResumoTexto(
            DashboardBemEstarResponseDTO resumo,
            AnaliseBemEstarIAResponseDTO analise
    ) {

        StringBuilder texto =
                new StringBuilder();

        texto.append(
                "Foram analisados "
        );

        texto.append(
                resumo.getTotalRegistros()
        );

        texto.append(
                " registros de bem-estar no período. "
        );

        if (resumo.getHumorPredominante() != null) {

            texto.append(
                    "O humor predominante foi "
            );

            texto.append(
                    resumo.getHumorPredominante()
            );

            texto.append(
                    ". "
            );
        }

        if ("MELHORA".equals(
                analise.getTendenciaHumor()
        )) {

            texto.append(
                    "Os registros indicam uma tendência de melhora do humor. "
            );

        } else if ("PIORA".equals(
                analise.getTendenciaHumor()
        )) {

            texto.append(
                    "Os registros indicam uma tendência de piora do humor. "
            );
        }

        if ("MELHORA".equals(
                analise.getTendenciaAnsiedade()
        )) {

            texto.append(
                    "Os níveis de ansiedade apresentaram melhora. "
            );

        } else if ("PIORA".equals(
                analise.getTendenciaAnsiedade()
        )) {

            texto.append(
                    "Os níveis de ansiedade apresentaram aumento ao longo do período. "
            );
        }

        return texto
                .toString()
                .trim();
    }
}