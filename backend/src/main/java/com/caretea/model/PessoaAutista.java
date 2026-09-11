package com.caretea.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pessoas_autistas")
public class PessoaAutista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private Integer nivelAutismo;

    private String vinculoResponsavel;

    private String whatsappResponsavel;

    private boolean enviarNotificacoesResponsavel;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}