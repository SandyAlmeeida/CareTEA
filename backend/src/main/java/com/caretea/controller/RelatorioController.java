package com.caretea.controller;

import com.caretea.dto.RelatorioGeralResponseDTO;
import com.caretea.service.RelatorioPdfService;
import com.caretea.service.RelatorioService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

@RestController
@RequestMapping("/relatorios")
public class RelatorioController {

    private final RelatorioService relatorioService;

    private final RelatorioPdfService relatorioPdfService;

    public RelatorioController(
            RelatorioService relatorioService,
            RelatorioPdfService relatorioPdfService
    ) {
        this.relatorioService =
                relatorioService;

        this.relatorioPdfService =
                relatorioPdfService;
    }

    @GetMapping("/geral")
    public ResponseEntity<RelatorioGeralResponseDTO> gerar(
            @RequestParam Long usuarioId,
            @RequestParam Long pessoaAutistaId,
            @RequestParam
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE
            )
            LocalDate inicio,
            @RequestParam
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE
            )
            LocalDate fim
    ) {
        return ResponseEntity.ok(
                relatorioService.gerar(
                        usuarioId,
                        pessoaAutistaId,
                        inicio,
                        fim
                )
        );
    }

    @GetMapping(
            value = "/pdf",
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    public ResponseEntity<byte[]> gerarPdf(
            @RequestParam Long usuarioId,
            @RequestParam Long pessoaAutistaId,
            @RequestParam
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE
            )
            LocalDate inicio,
            @RequestParam
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE
            )
            LocalDate fim
    ) {
        byte[] pdf =
                relatorioPdfService.gerar(
                        usuarioId,
                        pessoaAutistaId,
                        inicio,
                        fim
                );

        String nomeArquivo =
                "relatorio-caretea-"
                        + inicio
                        + "-"
                        + fim
                        + ".pdf";

        ContentDisposition disposition =
                ContentDisposition
                        .attachment()
                        .filename(
                                nomeArquivo,
                                StandardCharsets.UTF_8
                        )
                        .build();

        return ResponseEntity
                .ok()
                .contentType(
                        MediaType.APPLICATION_PDF
                )
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        disposition.toString()
                )
                .contentLength(
                        pdf.length
                )
                .body(pdf);
    }
}