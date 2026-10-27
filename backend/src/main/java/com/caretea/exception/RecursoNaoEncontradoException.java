package com.caretea.exception;

/**
 * Lançada quando um recurso solicitado não existe ou não pertence ao usuário.
 * Mapeada para HTTP 404 pelo GlobalExceptionHandler.
 */
public class RecursoNaoEncontradoException extends RuntimeException {

    public RecursoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }
}
