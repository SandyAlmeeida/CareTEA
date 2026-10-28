package com.caretea.dto;

import com.caretea.model.Humor;
import com.caretea.dto.LembreteResponseDTO;

import java.time.LocalDate;
import java.util.List;

public class RelatorioGeralResponseDTO {

    private Long usuarioId;
    private Long pessoaAutistaId;
    private LocalDate inicio;
    private LocalDate fim;

    private DocumentosResumo documentos;
    private BemEstarResumo bemEstar;

    private List<LembreteResponseDTO> lembretesMedicamento = List.of();
    private List<LembreteResponseDTO> lembretesConsulta = List.of();
    private List<LembreteResponseDTO> lembretesExame = List.of();

    private boolean medicamentosDisponiveis;
    private boolean agendaDisponivel;

    public RelatorioGeralResponseDTO() {
    }

    public RelatorioGeralResponseDTO(
            Long usuarioId,
            Long pessoaAutistaId,
            LocalDate inicio,
            LocalDate fim,
            DocumentosResumo documentos,
            BemEstarResumo bemEstar,
            boolean medicamentosDisponiveis,
            boolean agendaDisponivel
    ) {
        this.usuarioId = usuarioId;
        this.pessoaAutistaId = pessoaAutistaId;
        this.inicio = inicio;
        this.fim = fim;
        this.documentos = documentos;
        this.bemEstar = bemEstar;
        this.medicamentosDisponiveis = medicamentosDisponiveis;
        this.agendaDisponivel = agendaDisponivel;
    }

    public RelatorioGeralResponseDTO(
            Long usuarioId,
            Long pessoaAutistaId,
            LocalDate inicio,
            LocalDate fim,
            DocumentosResumo documentos,
            BemEstarResumo bemEstar,
            List<LembreteResponseDTO> lembretesMedicamento,
            List<LembreteResponseDTO> lembretesConsulta,
            List<LembreteResponseDTO> lembretesExame
    ) {
        this.usuarioId = usuarioId;
        this.pessoaAutistaId = pessoaAutistaId;
        this.inicio = inicio;
        this.fim = fim;
        this.documentos = documentos;
        this.bemEstar = bemEstar;
        this.lembretesMedicamento = lembretesMedicamento;
        this.lembretesConsulta = lembretesConsulta;
        this.lembretesExame = lembretesExame;
        this.medicamentosDisponiveis = !lembretesMedicamento.isEmpty();
        this.agendaDisponivel = !lembretesConsulta.isEmpty()
                || !lembretesExame.isEmpty();
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public Long getPessoaAutistaId() {
        return pessoaAutistaId;
    }

    public LocalDate getInicio() {
        return inicio;
    }

    public LocalDate getFim() {
        return fim;
    }

    public DocumentosResumo getDocumentos() {
        return documentos;
    }

    public BemEstarResumo getBemEstar() {
        return bemEstar;
    }

    public boolean isMedicamentosDisponiveis() {
        return medicamentosDisponiveis;
    }

    public boolean isAgendaDisponivel() {
        return agendaDisponivel;
    }

    public List<LembreteResponseDTO> getLembretesMedicamento() {
        return lembretesMedicamento;
    }

    public List<LembreteResponseDTO> getLembretesConsulta() {
        return lembretesConsulta;
    }

    public List<LembreteResponseDTO> getLembretesExame() {
        return lembretesExame;
    }

    public static class DocumentosResumo {

        private long total;
        private long receitas;
        private long laudos;
        private long exames;
        private long atestados;
        private long outros;

        public DocumentosResumo() {
        }

        public DocumentosResumo(
                long total,
                long receitas,
                long laudos,
                long exames,
                long atestados,
                long outros
        ) {
            this.total = total;
            this.receitas = receitas;
            this.laudos = laudos;
            this.exames = exames;
            this.atestados = atestados;
            this.outros = outros;
        }

        public long getTotal() {
            return total;
        }

        public long getReceitas() {
            return receitas;
        }

        public long getLaudos() {
            return laudos;
        }

        public long getExames() {
            return exames;
        }

        public long getAtestados() {
            return atestados;
        }

        public long getOutros() {
            return outros;
        }
    }

    public static class BemEstarResumo {

        private long totalRegistros;
        private Humor humorMaisRegistrado;

        private Double mediaAnsiedade;
        private Double mediaEnergia;
        private Double mediaQualidadeSono;
        private Double mediaHorasSono;
        private Double mediaSobrecargaSensorial;

        public BemEstarResumo() {
        }

        public BemEstarResumo(
                long totalRegistros,
                Humor humorMaisRegistrado,
                Double mediaAnsiedade,
                Double mediaEnergia,
                Double mediaQualidadeSono,
                Double mediaHorasSono,
                Double mediaSobrecargaSensorial
        ) {
            this.totalRegistros = totalRegistros;
            this.humorMaisRegistrado = humorMaisRegistrado;
            this.mediaAnsiedade = mediaAnsiedade;
            this.mediaEnergia = mediaEnergia;
            this.mediaQualidadeSono = mediaQualidadeSono;
            this.mediaHorasSono = mediaHorasSono;
            this.mediaSobrecargaSensorial =
                    mediaSobrecargaSensorial;
        }

        public long getTotalRegistros() {
            return totalRegistros;
        }

        public Humor getHumorMaisRegistrado() {
            return humorMaisRegistrado;
        }

        public Double getMediaAnsiedade() {
            return mediaAnsiedade;
        }

        public Double getMediaEnergia() {
            return mediaEnergia;
        }

        public Double getMediaQualidadeSono() {
            return mediaQualidadeSono;
        }

        public Double getMediaHorasSono() {
            return mediaHorasSono;
        }

        public Double getMediaSobrecargaSensorial() {
            return mediaSobrecargaSensorial;
        }
    }
}
