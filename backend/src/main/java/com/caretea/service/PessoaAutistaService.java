
package com.caretea.service;

import com.caretea.dto.CadastroPessoaAutistaDTO;
import com.caretea.model.PessoaAutista;
import com.caretea.model.Usuario;
import com.caretea.repository.PessoaAutistaRepository;
import com.caretea.repository.UsuarioRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PessoaAutistaService {

    private final PessoaAutistaRepository pessoaAutistaRepository;
    private final UsuarioRepository usuarioRepository;

    public PessoaAutistaService(
            PessoaAutistaRepository pessoaAutistaRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.pessoaAutistaRepository = pessoaAutistaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public PessoaAutista cadastrar(CadastroPessoaAutistaDTO dto) {

        if (dto.getNivelAutismo() == null
                || dto.getNivelAutismo() < 1
                || dto.getNivelAutismo() > 3) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O nível de suporte deve ser 1, 2 ou 3."
            );
        }

        Usuario usuario = null;
        Usuario responsavel = null;

        Integer nivel = dto.getNivelAutismo();

        if (dto.getUsuarioId() != null) {
            usuario = usuarioRepository.findById(dto.getUsuarioId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário autista não encontrado"));

            if (!"AUTISTA".equals(usuario.getTipoUsuario())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"O usuarioId deve pertencer a uma conta AUTISTA");
            }
        }

        if (dto.getResponsavelId() != null) {
            responsavel = usuarioRepository.findById(dto.getResponsavelId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Responsável não eonctrado"));

            if (!"RESPONSAVEL".equals(responsavel.getTipoUsuario())) {
                throw  new ResponseStatusException(HttpStatus.BAD_REQUEST, "O responsavelId deve pertencer a uma conta RESPONSAVEL");
            }
        }

        switch (nivel) {
            case 1 -> {
                if (usuario == null || responsavel != null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nível 1 exige uma conta AUTISTA e não permite responsável vinculado");
                }
            } case 2 -> {
                if (usuario == null || responsavel == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nível 2 exige uma conta AUTISTA e uma conta RESPONSAVEL");
                }
            } case 3 -> {
                if (usuario != null || responsavel == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nível 3 exige uma conta RESPONSAVEL e não permite login próprio");
                }
            } default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nível de suporte inválido");
        }

        if (dto.getResponsavelId() != null) {
            responsavel = usuarioRepository.findById(dto.getResponsavelId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Responsável não encontrado"
                    ));

            if (!"RESPONSAVEL".equals(responsavel.getTipoUsuario())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O usuário informado não é um responsável");
            }
        }

        if (dto.getNivelAutismo() == 2) {
            if (!"AUTISTA".equals(usuario.getTipoUsuario())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No nível 2, o usuário vinculado deve ser do tipo AUTISTA");
            }

            if (responsavel == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No nível 2, é obrigatório informar o responsável");
            }
        }

        PessoaAutista pessoaAutista = new PessoaAutista();

        pessoaAutista.setNome(dto.getNome());
        pessoaAutista.setNivelAutismo(dto.getNivelAutismo());
        pessoaAutista.setVinculoResponsavel(dto.getVinculoResponsavel());
        pessoaAutista.setWhatsappResponsavel(dto.getWhatsappResponsavel());

        pessoaAutista.setUsuario(usuario);
        pessoaAutista.setResponsavel(responsavel);

        pessoaAutista.setEnviarNotificacoesResponsavel(dto.isEnviarNotificacoesResponsavel());

        return pessoaAutistaRepository.save(pessoaAutista);
    }
}