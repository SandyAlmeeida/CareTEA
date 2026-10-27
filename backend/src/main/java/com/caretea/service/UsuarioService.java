
package com.caretea.service;

import com.caretea.dto.CadastroUsuarioDTO;
import com.caretea.dto.CadastroPessoaAutistaDTO;
import com.caretea.dto.LoginDTO;

import com.caretea.exception.CredenciaisInvalidasException;
import com.caretea.exception.EmailJaCadastradoException;

import com.caretea.model.Usuario;
import com.caretea.repository.UsuarioRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PessoaAutistaService pessoaAutistaService;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            PessoaAutistaService pessoaAutistaService,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.pessoaAutistaService = pessoaAutistaService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Usuario cadastrar(CadastroUsuarioDTO dto) {

        if (dto.getNome() == null
                || dto.getNome().isBlank()
                || dto.getEmail() == null
                || dto.getEmail().isBlank()
                || dto.getSenha() == null
                || dto.getSenha().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nome, e-mail e senha são obrigatórios."
            );
        }

        String tipoUsuario = dto.getTipoUsuario();
        Integer nivel = dto.getNivelAutismo();

        if (!"AUTISTA".equals(tipoUsuario)
                && !"RESPONSAVEL".equals(tipoUsuario)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Tipo de usuário inválido."
            );
        }

        if (nivel == null || nivel < 1 || nivel > 3) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O nível de suporte deve ser 1, 2 ou 3."
            );
        }

        if (nivel == 3 && !"RESPONSAVEL".equals(tipoUsuario)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Para o nível 3, a conta deve ser criada pelo responsável."
            );
        }

        String nomePessoaAutista;

        if ("RESPONSAVEL".equals(tipoUsuario)) {

            nomePessoaAutista = dto.getNomePessoaAutista();

            if (nomePessoaAutista == null
                    || nomePessoaAutista.isBlank()) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Informe o nome da pessoa autista."
                );
            }

        } else {
            nomePessoaAutista = dto.getNome();
        }

        String vinculoResponsavel;
        String whatsappResponsavel;

        if ("RESPONSAVEL".equals(tipoUsuario)) {

            vinculoResponsavel = dto.getVinculoResponsavel();

            if (vinculoResponsavel == null
                    || vinculoResponsavel.isBlank()) {

                vinculoResponsavel = "Responsavel";
            }

            whatsappResponsavel = dto.getWhatsapp();

        } else {

            vinculoResponsavel = dto.getVinculoResponsavel();
            whatsappResponsavel = dto.getWhatsappResponsavel();
        }

        boolean enviarNotificacoes =
                dto.isEnviarNotificacoesResponsavel();

        if (enviarNotificacoes
                && (whatsappResponsavel == null
                || whatsappResponsavel.isBlank())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Informe o WhatsApp do responsável para habilitar as notificações."
            );
        }

        if (usuarioRepository.existsByEmail(dto.getEmail())) {

            throw new EmailJaCadastradoException();
        }

        Usuario usuario = new Usuario();

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setWhatsapp(dto.getWhatsapp());

        usuario.setSenha(
                passwordEncoder.encode(dto.getSenha())
        );

        usuario.setTipoUsuario(tipoUsuario);

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        CadastroPessoaAutistaDTO pessoaDTO =
                new CadastroPessoaAutistaDTO();

        pessoaDTO.setNome(nomePessoaAutista);
        pessoaDTO.setNivelAutismo(nivel);
        pessoaDTO.setUsuarioId(usuarioSalvo.getId());

        pessoaDTO.setVinculoResponsavel(
                vinculoResponsavel
        );

        pessoaDTO.setWhatsappResponsavel(
                whatsappResponsavel
        );

        pessoaDTO.setEnviarNotificacoesResponsavel(
                enviarNotificacoes
        );

        pessoaAutistaService.cadastrar(pessoaDTO);

        return usuarioSalvo;
    }

    public Usuario login(LoginDTO dto) {

        Usuario usuario = usuarioRepository
                .findByEmail(dto.getEmail())
                .orElseThrow(CredenciaisInvalidasException::new);

        if (!passwordEncoder.matches(
                dto.getSenha(),
                usuario.getSenha()
        )) {

            throw new CredenciaisInvalidasException();
        }

        return usuario;
    }
}