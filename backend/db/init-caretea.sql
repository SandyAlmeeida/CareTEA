CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    whatsapp VARCHAR(50),
    senha VARCHAR(255),
    tipo_usuario VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS compromissos (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    especialidade VARCHAR(255),
    data DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME,
    local VARCHAR(255),
    observacoes VARCHAR(1000),
    lembrete BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_compromissos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT chk_compromissos_tipo CHECK (tipo IN ('CONSULTA','TERAPIA','EXAME','COMPROMISSO','RETORNO','RECEITA'))
);

CREATE INDEX IF NOT EXISTS idx_compromissos_usuario_data ON compromissos (usuario_id, data);

INSERT INTO usuarios (nome, email, tipo_usuario)
VALUES ('Usuário Teste', 'teste@caretea.com', 'responsavel')
ON CONFLICT (email) DO NOTHING;
