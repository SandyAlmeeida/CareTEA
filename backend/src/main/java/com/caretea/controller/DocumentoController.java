package com.caretea.controller;

import com.caretea.dto.DocumentoResponseDTO;
import com.caretea.model.Documento;
import com.caretea.model.TipoDocumento;
import com.caretea.service.DocumentoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/documentos")
@CrossOrigin(origins = "*")
public class DocumentoController {

    private final DocumentoService documentoService;

    public DocumentoController(
            DocumentoService documentoService
    ) {
        this.documentoService = documentoService;
    }

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<DocumentoResponseDTO> salvar(
            @RequestParam Long pessoaAutistaId,
            @RequestParam String nome,
            @RequestParam TipoDocumento tipo,
            @RequestParam(required = false) String descricao,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dataDocumento,
            @RequestPart MultipartFile arquivo
    ) {
        DocumentoResponseDTO documento =
                documentoService.salvar(
                        pessoaAutistaId,
                        nome,
                        tipo,
                        descricao,
                        dataDocumento,
                        arquivo
                );

        return ResponseEntity.ok(documento);
    }

    @GetMapping("/perfil/{pessoaAutistaId}")
    public ResponseEntity<List<DocumentoResponseDTO>> listar(
            @PathVariable Long pessoaAutistaId
    ) {
        return ResponseEntity.ok(
                documentoService.listarPorPerfil(
                        pessoaAutistaId
                )
        );
    }

    @GetMapping("/{id}/arquivo")
    public ResponseEntity<byte[]> visualizarArquivo(
            @PathVariable Long id
    ) {
        Documento documento =
                documentoService.buscarArquivo(id);

        MediaType mediaType;

        try {
            mediaType = MediaType.parseMediaType(
                    documento.getTipoMime()
            );
        } catch (Exception e) {
            mediaType =
                    MediaType.APPLICATION_OCTET_STREAM;
        }

        ContentDisposition disposition =
                ContentDisposition
                        .inline()
                        .filename(
                                documento.getNomeArquivo(),
                                StandardCharsets.UTF_8
                        )
                        .build();

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        disposition.toString()
                )
                .body(documento.getConteudo());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id
    ) {
        documentoService.excluir(id);

        return ResponseEntity.noContent().build();
    }
}