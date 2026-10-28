package com.caretea.service;

import com.caretea.dto.CadastroPessoaAutistaDTO;
import com.caretea.dto.PessoaAutistaRequestDTO;
import com.caretea.dto.PessoaAutistaResponseDTO;
import com.caretea.model.PessoaAutista;
import com.caretea.model.Usuario;
import com.caretea.repository.PessoaAutistaRepository;
import com.caretea.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Method;

@Service
public class PessoaAutistaService {

    private final PessoaAutistaRepository pessoaAutistaRepository;
    private final UsuarioRepository usuarioRepository;

    public PessoaAutistaService(
            PessoaAutistaRepository pessoaAutistaRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.pessoaAutistaRepository =
                pessoaAutistaRepository;

        this.usuarioRepository =
                usuarioRepository;
    }

    /*
     * =====================================================
     * COMPATIBILIDADE COM O CADASTRO ANTIGO
     * =====================================================
     *
     * Este método já era usado por:
     *
     * PessoaAutistaController
     * UsuarioService
     *
     * Por isso precisamos mantê-lo.
     */
    public PessoaAutista cadastrar(
            CadastroPessoaAutistaDTO dto
    ) {

        if (dto == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Os dados da pessoa autista são obrigatórios."
            );
        }

        String nome =
                converterString(
                        lerValor(
                                dto,
                                "nome",
                                "nomePessoaAutista",
                                "autisticPersonName"
                        )
                );

        Integer nivelAutismo =
                converterInteger(
                        lerValor(
                                dto,
                                "nivelAutismo",
                                "autismLevel"
                        )
                );

        String vinculoResponsavel =
                converterString(
                        lerValor(
                                dto,
                                "vinculoResponsavel",
                                "relationship"
                        )
                );

        String whatsappResponsavel =
                converterString(
                        lerValor(
                                dto,
                                "whatsappResponsavel",
                                "responsibleWhatsapp",
                                "whatsapp"
                        )
                );

        Boolean enviarNotificacoes =
                converterBoolean(
                        lerValor(
                                dto,
                                "enviarNotificacoesResponsavel",
                                "notifyResponsible",
                                "enviarNotificacoes"
                        )
                );

        Object usuarioRecebido =
                lerValor(
                        dto,
                        "usuario",
                        "usuarioId",
                        "userId"
                );

        Usuario usuario =
                resolverUsuario(
                        usuarioRecebido
                );

        if (
                nome == null ||
                        nome.isBlank()
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O nome da pessoa autista é obrigatório."
            );
        }

        if (
                nivelAutismo == null ||
                        nivelAutismo < 1 ||
                        nivelAutismo > 3
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O nível de autismo deve ser 1, 2 ou 3."
            );
        }

        PessoaAutista pessoa =
                new PessoaAutista();

        pessoa.setNome(
                nome.trim()
        );

        pessoa.setNivelAutismo(
                nivelAutismo
        );

        pessoa.setVinculoResponsavel(
                normalizarTexto(
                        vinculoResponsavel
                )
        );

        pessoa.setWhatsappResponsavel(
                normalizarWhatsapp(
                        whatsappResponsavel
                )
        );

        pessoa.setEnviarNotificacoesResponsavel(
                Boolean.TRUE.equals(
                        enviarNotificacoes
                )
        );

        pessoa.setUsuario(
                usuario
        );

        aplicarRegrasNivel(
                pessoa
        );

        return pessoaAutistaRepository.save(
                pessoa
        );
    }

    /*
     * =====================================================
     * NOVO CADASTRO USANDO DTO NOVO
     * =====================================================
     */

    public PessoaAutistaResponseDTO criar(
            Long usuarioId,
            PessoaAutistaRequestDTO request
    ) {

        Usuario usuario =
                usuarioRepository
                        .findById(usuarioId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Usuário não encontrado."
                                )
                        );

        validarRequest(
                request
        );

        PessoaAutista pessoa =
                new PessoaAutista();

        pessoa.setNome(
                request.nome().trim()
        );

        pessoa.setNivelAutismo(
                request.nivelAutismo()
        );

        pessoa.setVinculoResponsavel(
                normalizarTexto(
                        request.vinculoResponsavel()
                )
        );

        pessoa.setWhatsappResponsavel(
                normalizarWhatsapp(
                        request.whatsappResponsavel()
                )
        );

        pessoa.setEnviarNotificacoesResponsavel(
                definirEnvioResponsavel(
                        request
                )
        );

        pessoa.setUsuario(
                usuario
        );

        aplicarRegrasNivel(
                pessoa
        );

        PessoaAutista salva =
                pessoaAutistaRepository.save(
                        pessoa
                );

        return converter(
                salva
        );
    }

    /*
     * =====================================================
     * CONSULTA
     * =====================================================
     */

    public PessoaAutistaResponseDTO buscar(
            Long pessoaAutistaId,
            Long usuarioId
    ) {

        PessoaAutista pessoa =
                buscarEntidadeVinculada(
                        pessoaAutistaId,
                        usuarioId
                );

        return converter(
                pessoa
        );
    }

    /*
     * =====================================================
     * ATUALIZAÇÃO
     * =====================================================
     */

    public PessoaAutistaResponseDTO atualizar(
            Long pessoaAutistaId,
            Long usuarioId,
            PessoaAutistaRequestDTO request
    ) {

        validarRequest(
                request
        );

        PessoaAutista pessoa =
                buscarEntidadeVinculada(
                        pessoaAutistaId,
                        usuarioId
                );

        pessoa.setNome(
                request.nome().trim()
        );

        pessoa.setNivelAutismo(
                request.nivelAutismo()
        );

        pessoa.setVinculoResponsavel(
                normalizarTexto(
                        request.vinculoResponsavel()
                )
        );

        pessoa.setWhatsappResponsavel(
                normalizarWhatsapp(
                        request.whatsappResponsavel()
                )
        );

        pessoa.setEnviarNotificacoesResponsavel(
                definirEnvioResponsavel(
                        request
                )
        );

        aplicarRegrasNivel(
                pessoa
        );

        PessoaAutista atualizada =
                pessoaAutistaRepository.save(
                        pessoa
                );

        return converter(
                atualizada
        );
    }

    /*
     * =====================================================
     * VALIDA VÍNCULO
     * =====================================================
     */

    public PessoaAutista buscarEntidadeVinculada(
            Long pessoaAutistaId,
            Long usuarioId
    ) {

        if (
                pessoaAutistaId == null ||
                        usuarioId == null
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Pessoa autista e usuário são obrigatórios."
            );
        }

        PessoaAutista pessoa =
                pessoaAutistaRepository
                        .findById(
                                pessoaAutistaId
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Pessoa autista não encontrada."
                                )
                        );

        if (
                pessoa.getUsuario() == null ||
                        pessoa.getUsuario()
                                .getId() == null ||
                        !pessoa.getUsuario()
                                .getId()
                                .equals(usuarioId)
        ) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Esta pessoa autista não está vinculada a este usuário."
            );
        }

        return pessoa;
    }

    /*
     * =====================================================
     * REGRA DO MEU DIA
     * =====================================================
     */

    public void validarAcessoMeuDia(
            PessoaAutista pessoa
    ) {

        if (pessoa == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Pessoa autista não encontrada."
            );
        }

        if (
                pessoa.getNivelAutismo() == null ||
                        pessoa.getNivelAutismo() != 2
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O acesso Meu Dia está disponível apenas para pessoas autistas de nível 2."
            );
        }
    }

    /*
     * =====================================================
     * VALIDAÇÕES
     * =====================================================
     */

    private void validarRequest(
            PessoaAutistaRequestDTO request
    ) {

        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Os dados da pessoa autista são obrigatórios."
            );
        }

        if (
                request.nome() == null ||
                        request.nome().isBlank()
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O nome da pessoa autista é obrigatório."
            );
        }

        if (
                request.nivelAutismo() == null ||
                        request.nivelAutismo() < 1 ||
                        request.nivelAutismo() > 3
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O nível de autismo deve ser 1, 2 ou 3."
            );
        }
    }

    private void aplicarRegrasNivel(
            PessoaAutista pessoa
    ) {

        int nivel =
                pessoa.getNivelAutismo();

        if (nivel == 1) {
            return;
        }

        /*
         * Níveis 2 e 3:
         * notificações são direcionadas
         * ao responsável.
         */
        pessoa.setEnviarNotificacoesResponsavel(
                true
        );

        if (
                pessoa.getWhatsappResponsavel() == null ||
                        pessoa.getWhatsappResponsavel()
                                .isBlank()
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O WhatsApp do responsável é obrigatório para os níveis 2 e 3."
            );
        }
    }

    private boolean definirEnvioResponsavel(
            PessoaAutistaRequestDTO request
    ) {

        if (
                request.nivelAutismo() != null &&
                        request.nivelAutismo() >= 2
        ) {
            return true;
        }

        return Boolean.TRUE.equals(
                request.enviarNotificacoesResponsavel()
        );
    }

    /*
     * =====================================================
     * UTILITÁRIOS
     * =====================================================
     */

    private Usuario resolverUsuario(
            Object valor
    ) {

        if (valor instanceof Usuario usuario) {
            return usuario;
        }

        if (valor instanceof Number numero) {

            Long id =
                    numero.longValue();

            return usuarioRepository
                    .findById(id)
                    .orElseThrow(() ->
                            new ResponseStatusException(
                                    HttpStatus.NOT_FOUND,
                                    "Usuário não encontrado."
                            )
                    );
        }

        if (valor instanceof String texto) {

            try {

                Long id =
                        Long.parseLong(
                                texto
                        );

                return usuarioRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Usuário não encontrado."
                                )
                        );

            } catch (
                    NumberFormatException ignored
            ) {
            }
        }

        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "O usuário responsável é obrigatório."
        );
    }

    /*
     * Este método permite manter compatibilidade
     * com o CadastroPessoaAutistaDTO antigo,
     * independentemente de ele ser record ou class.
     */
    private Object lerValor(
            Object objeto,
            String... nomes
    ) {

        for (
                String nome
                : nomes
        ) {

            String primeiraMaiuscula =
                    Character.toUpperCase(
                            nome.charAt(0)
                    )
                            + nome.substring(1);

            String[] metodos = {
                    nome,
                    "get" + primeiraMaiuscula,
                    "is" + primeiraMaiuscula
            };

            for (
                    String metodoNome
                    : metodos
            ) {

                try {

                    Method metodo =
                            objeto
                                    .getClass()
                                    .getMethod(
                                            metodoNome
                                    );

                    return metodo.invoke(
                            objeto
                    );

                } catch (
                        ReflectiveOperationException ignored
                ) {
                }
            }
        }

        return null;
    }

    private String converterString(
            Object valor
    ) {

        if (valor == null) {
            return null;
        }

        String texto =
                String.valueOf(
                                valor
                        )
                        .trim();

        return texto.isBlank()
                ? null
                : texto;
    }

    private Integer converterInteger(
            Object valor
    ) {

        if (valor == null) {
            return null;
        }

        if (valor instanceof Number numero) {
            return numero.intValue();
        }

        try {

            return Integer.parseInt(
                    String.valueOf(
                            valor
                    )
            );

        } catch (
                NumberFormatException e
        ) {

            return null;
        }
    }

    private Boolean converterBoolean(
            Object valor
    ) {

        if (valor == null) {
            return false;
        }

        if (valor instanceof Boolean booleano) {
            return booleano;
        }

        return Boolean.parseBoolean(
                String.valueOf(
                        valor
                )
        );
    }

    private String normalizarTexto(
            String valor
    ) {

        if (
                valor == null ||
                        valor.isBlank()
        ) {
            return null;
        }

        return valor.trim();
    }

    private String normalizarWhatsapp(
            String whatsapp
    ) {

        if (
                whatsapp == null ||
                        whatsapp.isBlank()
        ) {
            return null;
        }

        String numeros =
                whatsapp.replaceAll(
                        "\\D",
                        ""
                );

        /*
         * Aceita também +55 no banco/cadastro.
         */
        if (
                numeros.length() != 10 &&
                        numeros.length() != 11 &&
                        numeros.length() != 12 &&
                        numeros.length() != 13
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "WhatsApp inválido."
            );
        }

        return numeros;
    }

    private PessoaAutistaResponseDTO converter(
            PessoaAutista pessoa
    ) {

        Long usuarioId =
                pessoa.getUsuario() != null
                        ? pessoa.getUsuario()
                        .getId()
                        : null;

        return new PessoaAutistaResponseDTO(
                pessoa.getId(),
                pessoa.getNome(),
                pessoa.getNivelAutismo(),
                pessoa.getVinculoResponsavel(),
                pessoa.getWhatsappResponsavel(),
                pessoa.isEnviarNotificacoesResponsavel(),
                usuarioId
        );
    }
}