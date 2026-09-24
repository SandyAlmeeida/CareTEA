
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

        Usuario usuario = usuarioRepository
                .findById(dto.getUsuarioId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado."
                ));

        if (dto.getNivelAutismo() == 3
                && !"RESPONSAVEL".equals(usuario.getTipoUsuario())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Para o nível 3, o cadastro deve ser realizado por um responsável."
            );
        }

        PessoaAutista pessoaAutista = new PessoaAutista();

        pessoaAutista.setNome(dto.getNome());
        pessoaAutista.setNivelAutismo(dto.getNivelAutismo());
        pessoaAutista.setVinculoResponsavel(
                dto.getVinculoResponsavel()
        );
        pessoaAutista.setWhatsappResponsavel(
                dto.getWhatsappResponsavel()
        );
        pessoaAutista.setUsuario(usuario);

        pessoaAutista.setEnviarNotificacoesResponsavel(
                dto.isEnviarNotificacoesResponsavel()
        );

        return pessoaAutistaRepository.save(pessoaAutista);
    }
}