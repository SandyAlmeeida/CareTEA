package com.caretea.service;

import com.caretea.dto.DocumentoResponseDTO;
import com.caretea.model.Documento;
import com.caretea.model.TipoDocumento;
import com.caretea.repository.DocumentoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
public class DocumentoService {

    private static final long TAMANHO_MAXIMO = 10 * 1024 * 1024;

    private final DocumentoRepository documentoRepository;

    public DocumentoService(
            DocumentoRepository documentoRepository
    ) {
        this.documentoRepository = documentoRepository;
    }

    public DocumentoResponseDTO salvar(
            Long pessoaAutistaId,
            String nome,
            TipoDocumento tipo,
            String descricao,
            LocalDate dataDocumento,
            MultipartFile arquivo
    ) {
        validar(
                pessoaAutistaId,
                nome,
                tipo,
                dataDocumento,
                arquivo
        );

        Documento documento = new Documento();

        documento.setPessoaAutistaId(pessoaAutistaId);
        documento.setNome(nome.trim());
        documento.setTipo(tipo);
        documento.setDescricao(
                descricao == null || descricao.isBlank()
                        ? null
                        : descricao.trim()
        );
        documento.setDataDocumento(dataDocumento);
        documento.setNomeArquivo(arquivo.getOriginalFilename());
        documento.setTipoMime(
                arquivo.getContentType() == null
                        ? "application/octet-stream"
                        : arquivo.getContentType()
        );
        documento.setTamanhoArquivo(arquivo.getSize());

        try {
            documento.setConteudo(arquivo.getBytes());
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Não foi possível ler o arquivo."
            );
        }

        return converter(
                documentoRepository.save(documento)
        );
    }

    public List<DocumentoResponseDTO> listarPorPerfil(
            Long pessoaAutistaId
    ) {
        return documentoRepository
                .findByPessoaAutistaIdOrderByDataDocumentoDescCriadoEmDesc(
                        pessoaAutistaId
                )
                .stream()
                .map(this::converter)
                .toList();
    }

    public Documento buscarArquivo(Long id) {
        return documentoRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Documento não encontrado."
                        )
                );
    }

    public void excluir(Long id) {
        Documento documento = buscarArquivo(id);
        documentoRepository.delete(documento);
    }

    private void validar(
            Long pessoaAutistaId,
            String nome,
            TipoDocumento tipo,
            LocalDate dataDocumento,
            MultipartFile arquivo
    ) {
        if (pessoaAutistaId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O perfil é obrigatório."
            );
        }

        if (nome == null || nome.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O nome do documento é obrigatório."
            );
        }

        if (nome.length() > 150) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O nome deve possuir no máximo 150 caracteres."
            );
        }

        if (tipo == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O tipo do documento é obrigatório."
            );
        }

        if (dataDocumento == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A data do documento é obrigatória."
            );
        }

        if (arquivo == null || arquivo.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O arquivo é obrigatório."
            );
        }

        if (arquivo.getSize() > TAMANHO_MAXIMO) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O arquivo deve possuir no máximo 10 MB."
            );
        }
    }

    private DocumentoResponseDTO converter(
            Documento documento
    ) {
        return new DocumentoResponseDTO(
                documento.getId(),
                documento.getPessoaAutistaId(),
                documento.getNome(),
                documento.getTipo(),
                documento.getDescricao(),
                documento.getDataDocumento(),
                documento.getNomeArquivo(),
                documento.getTipoMime(),
                documento.getTamanhoArquivo(),
                documento.getCriadoEm()
        );
    }
}