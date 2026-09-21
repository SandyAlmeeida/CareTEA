-- Tabela da agenda: consultas, exames, terapias e demais compromissos.
-- O tipo diferencia a categoria (alinhado às chaves de TIPOS no front).

CREATE TABLE compromissos (
    id              BIGSERIAL PRIMARY KEY,
    usuario_id      BIGINT       NOT NULL,
    tipo            VARCHAR(20)  NOT NULL,
    titulo          VARCHAR(255) NOT NULL,
    especialidade   VARCHAR(255),
    data            DATE         NOT NULL,
    horario_inicio  TIME         NOT NULL,
    horario_fim     TIME,
    local           VARCHAR(255),
    observacoes     VARCHAR(1000),
    lembrete        BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_compromissos_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT chk_compromissos_tipo
        CHECK (tipo IN ('CONSULTA','TERAPIA','EXAME','COMPROMISSO','RETORNO','RECEITA'))
);

-- Índice para acelerar as buscas por dia, semana e mês de cada usuário.
CREATE INDEX idx_compromissos_usuario_data
    ON compromissos (usuario_id, data);
