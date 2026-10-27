package com.caretea.service;

import com.caretea.dto.RelatorioGeralResponseDTO;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class RelatorioPdfService {

    private final RelatorioService relatorioService;

    private static final DateTimeFormatter DATA_FORMATADA =
            DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public RelatorioPdfService(
            RelatorioService relatorioService
    ) {
        this.relatorioService =
                relatorioService;
    }

    public byte[] gerar(
            Long usuarioId,
            Long pessoaAutistaId,
            LocalDate inicio,
            LocalDate fim
    ) {
        RelatorioGeralResponseDTO relatorio =
                relatorioService.gerar(
                        usuarioId,
                        pessoaAutistaId,
                        inicio,
                        fim
                );

        try (
                PDDocument documento =
                        new PDDocument();

                ByteArrayOutputStream saida =
                        new ByteArrayOutputStream()
        ) {
            PDType1Font fonte =
                    new PDType1Font(
                            Standard14Fonts.FontName.HELVETICA
                    );

            PDType1Font fonteNegrito =
                    new PDType1Font(
                            Standard14Fonts.FontName.HELVETICA_BOLD
                    );

            EscritorPdf escritor =
                    new EscritorPdf(
                            documento,
                            fonte,
                            fonteNegrito
                    );

            escritor.titulo(
                    "CareTEA - Relatorio de acompanhamento"
            );

            escritor.texto(
                    "Periodo: "
                            + inicio.format(DATA_FORMATADA)
                            + " ate "
                            + fim.format(DATA_FORMATADA)
            );

            escritor.espaco();

            escreverBemEstar(
                    escritor,
                    relatorio.getBemEstar()
            );

            escritor.espaco();

            escreverDocumentos(
                    escritor,
                    relatorio.getDocumentos()
            );

            escritor.espaco();

            escritor.subtitulo(
                    "Medicamentos"
            );

            escritor.texto(
                    relatorio.isMedicamentosDisponiveis()
                            ? "Dados de medicamentos disponiveis."
                            : "Modulo de medicamentos ainda nao integrado."
            );

            escritor.espaco();

            escritor.subtitulo(
                    "Agenda"
            );

            escritor.texto(
                    relatorio.isAgendaDisponivel()
                            ? "Dados de agenda disponiveis."
                            : "Modulo de agenda ainda nao integrado."
            );

            escritor.espaco();

            escritor.texto(
                    "Este relatorio resume os registros do CareTEA."
            );

            escritor.texto(
                    "Ele nao substitui avaliacao medica, laudo ou prontuario profissional."
            );

            escritor.fechar();

            documento.save(saida);

            return saida.toByteArray();

        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Nao foi possivel gerar o PDF.",
                    e
            );
        }
    }

    private void escreverBemEstar(
            EscritorPdf escritor,
            RelatorioGeralResponseDTO.BemEstarResumo bemEstar
    ) throws IOException {

        escritor.subtitulo(
                "Bem-estar"
        );

        if (bemEstar == null) {
            escritor.texto(
                    "Nenhum dado de bem-estar disponivel."
            );

            return;
        }

        escritor.texto(
                "Registros: "
                        + bemEstar.getTotalRegistros()
        );

        escritor.texto(
                "Humor mais registrado: "
                        + (
                        bemEstar.getHumorMaisRegistrado() != null
                                ? bemEstar
                                .getHumorMaisRegistrado()
                                .name()
                                .replace("_", " ")
                                : "Sem registros"
                )
        );

        escritor.texto(
                "Media de ansiedade: "
                        + formatarNumero(
                        bemEstar.getMediaAnsiedade()
                )
        );

        escritor.texto(
                "Media de energia: "
                        + formatarNumero(
                        bemEstar.getMediaEnergia()
                )
        );

        escritor.texto(
                "Media da qualidade do sono: "
                        + formatarNumero(
                        bemEstar.getMediaQualidadeSono()
                )
        );

        escritor.texto(
                "Media de horas de sono: "
                        + formatarNumero(
                        bemEstar.getMediaHorasSono()
                )
        );

        escritor.texto(
                "Media de sobrecarga sensorial: "
                        + formatarNumero(
                        bemEstar.getMediaSobrecargaSensorial()
                )
        );
    }

    private void escreverDocumentos(
            EscritorPdf escritor,
            RelatorioGeralResponseDTO.DocumentosResumo documentos
    ) throws IOException {

        escritor.subtitulo(
                "Documentos"
        );

        if (documentos == null) {
            escritor.texto(
                    "Nenhum documento disponivel."
            );

            return;
        }

        escritor.texto(
                "Total: "
                        + documentos.getTotal()
        );

        escritor.texto(
                "Receitas: "
                        + documentos.getReceitas()
        );

        escritor.texto(
                "Laudos: "
                        + documentos.getLaudos()
        );

        escritor.texto(
                "Exames: "
                        + documentos.getExames()
        );

        escritor.texto(
                "Atestados: "
                        + documentos.getAtestados()
        );

        escritor.texto(
                "Outros: "
                        + documentos.getOutros()
        );
    }

    private String formatarNumero(
            Double valor
    ) {
        if (valor == null) {
            return "Sem dados";
        }

        return String.format(
                Locale.forLanguageTag("pt-BR"),
                "%.2f",
                valor
        );
    }

    private static class EscritorPdf {

        private final PDDocument documento;

        private final PDType1Font fonte;

        private final PDType1Font fonteNegrito;

        private PDPageContentStream stream;

        private float y;

        public EscritorPdf(
                PDDocument documento,
                PDType1Font fonte,
                PDType1Font fonteNegrito
        ) throws IOException {

            this.documento =
                    documento;

            this.fonte =
                    fonte;

            this.fonteNegrito =
                    fonteNegrito;

            novaPagina();
        }

        public void titulo(
                String texto
        ) throws IOException {

            escrever(
                    texto,
                    fonteNegrito,
                    18,
                    28
            );
        }

        public void subtitulo(
                String texto
        ) throws IOException {

            escrever(
                    texto,
                    fonteNegrito,
                    14,
                    22
            );
        }

        public void texto(
                String texto
        ) throws IOException {

            escrever(
                    texto,
                    fonte,
                    11,
                    17
            );
        }

        public void espaco() {
            y -= 10;
        }

        private void escrever(
                String texto,
                PDType1Font fonteLinha,
                float tamanhoFonte,
                float espacamento
        ) throws IOException {

            verificarEspaco();

            stream.beginText();

            stream.setFont(
                    fonteLinha,
                    tamanhoFonte
            );

            stream.newLineAtOffset(
                    50,
                    y
            );

            stream.showText(
                    limparTexto(texto)
            );

            stream.endText();

            y -= espacamento;
        }

        private void verificarEspaco()
                throws IOException {

            if (y > 60) {
                return;
            }

            stream.close();

            novaPagina();
        }

        private void novaPagina()
                throws IOException {

            PDPage pagina =
                    new PDPage(
                            PDRectangle.A4
                    );

            documento.addPage(
                    pagina
            );

            stream =
                    new PDPageContentStream(
                            documento,
                            pagina
                    );

            y = 790;
        }

        private String limparTexto(
                String texto
        ) {
            if (texto == null) {
                return "";
            }

            return texto
                    .replace("—", "-")
                    .replace("–", "-")
                    .replace("•", "-");
        }

        public void fechar()
                throws IOException {

            if (stream != null) {
                stream.close();
            }
        }
    }
}