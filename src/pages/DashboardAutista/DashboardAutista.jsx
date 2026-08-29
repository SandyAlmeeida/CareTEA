import { useState } from "react";
import "./DashboardMeuDia.css";

const medicamentosDoDia = [
  {
    id: 1,
    nome: "Escitalopram",
    quantidade: 2,
    dose: "10 mg",
    horario: "08:00",
    periodo: "Manhã",
  },
  {
    id: 2,
    nome: "Risperidona",
    quantidade: 1,
    dose: "1 mg",
    horario: "14:00",
    periodo: "Tarde",
  },
  {
    id: 3,
    nome: "Risperidona",
    quantidade: 2,
    dose: "2 mg",
    horario: "20:00",
    periodo: "Noite",
  },
];

function DashboardAutista() {
  const [humor, setHumor] = useState("");
  const [medicamentosTomados, setMedicamentosTomados] = useState([]);
  const [chatAberto, setChatAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      autor: "care",
      texto: "Oi, Evellyn! 💜 Como posso te ajudar hoje?",
    },
  ]);

  const confirmarMedicamento = (id) => {
    setMedicamentosTomados((anteriores) => {
      if (anteriores.includes(id)) {
        return anteriores;
      }

      return [...anteriores, id];
    });
  };

  const pedirAjuda = () => {
    alert("Seu responsável será avisado.");
  };

  const enviarMensagem = async (event) => {
    event.preventDefault();

    const texto = mensagem.trim();

    if (!texto) {
      return;
    }

    setMensagens((atuais) => [
      ...atuais,
      {
        id: Date.now(),
        autor: "usuario",
        texto,
      },
    ]);

    setMensagem("");

    try {
      const resposta = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texto,
        }),
      });

      const dados = await resposta.json();

      setMensagens((atuais) => [
        ...atuais,
        {
          id: Date.now() + 1,
          autor: "care",
          texto: dados.resposta || "Não consegui responder agora.",
        },
      ]);
    } catch {
      setMensagens((atuais) => [
        ...atuais,
        {
          id: Date.now() + 1,
          autor: "care",
          texto: "Não consegui responder agora.",
        },
      ]);
    }
  };

  return (
    <div className="autista-page">
      <main className="autista-main">
        <div className="autista-brand">
          <div className="brand-colors" aria-hidden="true">
            <span className="brand-color brand-blue"></span>
            <span className="brand-color brand-purple"></span>
            <span className="brand-color brand-yellow"></span>
            <span className="brand-color brand-green"></span>
            <span className="brand-color brand-red"></span>
          </div>

          <span className="brand-name">
            Care<span>TEA</span>
          </span>
        </div>

        <header className="welcome-card">
          <div className="welcome-circle welcome-circle-one"></div>
          <div className="welcome-circle welcome-circle-two"></div>

          <div className="welcome-content">
            <span className="welcome-label">Meu dia</span>

            <h1>
              Olá, Evellyn! <span className="wave">👋</span>
            </h1>

            <p>Aqui está tudo o que você precisa saber hoje.</p>
          </div>

          <div className="welcome-profile">L</div>
        </header>

        <section className="care-section mood-section">
          <div className="section-heading">
            <div className="section-icon mood-icon">☺</div>

            <div>
              <h2>Como você está hoje?</h2>
              <p>Escolha como você está se sentindo agora.</p>
            </div>
          </div>

          <div className="mood-options">
            <button
              type="button"
              aria-pressed={humor === "bem"}
              className={`mood-option ${
                humor === "bem" ? "selected mood-good" : ""
              }`}
              onClick={() => setHumor("bem")}
            >
              <span className="mood-face">😊</span>
              <strong>Estou bem</strong>
            </button>

            <button
              type="button"
              aria-pressed={humor === "mais-ou-menos"}
              className={`mood-option ${
                humor === "mais-ou-menos"
                  ? "selected mood-medium"
                  : ""
              }`}
              onClick={() => setHumor("mais-ou-menos")}
            >
              <span className="mood-face">😐</span>
              <strong>Mais ou menos</strong>
            </button>

            <button
              type="button"
              aria-pressed={humor === "mal"}
              className={`mood-option ${
                humor === "mal" ? "selected mood-bad" : ""
              }`}
              onClick={() => setHumor("mal")}
            >
              <span className="mood-face">😣</span>
              <strong>Não estou bem</strong>
            </button>
          </div>

          {humor && (
            <div className="mood-confirmation">
              <span>✓</span>
              Obrigado por contar como você está.
            </div>
          )}
        </section>

        <section className="care-section medication-section">
          <div className="section-accent medication-accent"></div>

          <div className="section-heading">
            <div className="section-icon medication-icon">💊</div>

            <div>
              <span className="section-label">Sua rotina</span>
              <h2>Medicamentos de hoje</h2>
              <p>Veja os medicamentos e os horários de hoje.</p>
            </div>
          </div>

          <div className="medication-list">
            {medicamentosDoDia.map((medicamento) => {
              const tomado = medicamentosTomados.includes(
                medicamento.id
              );

              return (
                <article
                  className={`medication-item ${
                    tomado ? "medication-item-taken" : ""
                  }`}
                  key={medicamento.id}
                >
                  <div className="medication-item-top">
                    <div className="medication-main-info">
                      <span className="medication-period">
                        {medicamento.periodo}
                      </span>

                      <h3>{medicamento.nome}</h3>

                      <span className="medication-dose">
                        {medicamento.quantidade}{" "}
                        {medicamento.quantidade === 1
                          ? "comprimido"
                          : "comprimidos"}{" "}
                        de {medicamento.dose}
                      </span>
                    </div>

                    <div className="medication-time">
                      <span className="clock-icon">◷</span>
                      <strong>{medicamento.horario}</strong>
                    </div>
                  </div>

                  {!tomado ? (
                    <button
                      type="button"
                      className="taken-button"
                      onClick={() =>
                        confirmarMedicamento(medicamento.id)
                      }
                    >
                      <span className="check-circle">✓</span>
                      Já tomei
                    </button>
                  ) : (
                    <div className="taken-confirmation">
                      <span className="taken-check">✓</span>

                      <div>
                        <strong>Confirmado!</strong>
                        <span>
                          Você marcou este medicamento como tomado.
                        </span>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="care-section appointment-section">
          <div className="section-accent appointment-accent"></div>

          <div className="section-heading">
            <div className="section-icon appointment-icon">📅</div>

            <div>
              <span className="section-label">
                Próxima consulta
              </span>

              <h2>Neurologista</h2>
            </div>
          </div>

          <div className="appointment-info">
            <div className="appointment-date">
              <strong>29</strong>
              <span>AGO</span>
            </div>

            <div className="appointment-text">
              <strong>Amanhã às 14:00</strong>
              <span>
                Vamos te lembrar quando estiver perto.
              </span>
            </div>
          </div>
        </section>

        <section className="quick-actions">
          <button
            type="button"
            className="quick-action care-ai"
            aria-expanded={chatAberto}
            onClick={() => setChatAberto((aberto) => !aberto)}
          >
            <div className="quick-icon care-icon">✦</div>

            <div className="quick-text">
              <strong>Conversar com a Care</strong>
              <span>
                Quero conversar ou contar alguma coisa
              </span>
            </div>

            <span className="quick-arrow">
              {chatAberto ? "⌃" : "›"}
            </span>
          </button>

          <button
            type="button"
            className="quick-action care-help"
            onClick={pedirAjuda}
          >
            <div className="quick-icon help-icon">♡</div>

            <div className="quick-text">
              <strong>Preciso de ajuda</strong>
              <span>Quero avisar meu responsável</span>
            </div>

            <span className="quick-arrow">›</span>
          </button>
        </section>

        {chatAberto && (
          <section className="care-chat" aria-label="Conversa com a Care">
            <header className="care-chat-header">
              <div className="care-chat-avatar">✦</div>

              <div>
                <strong>Care</strong>
                <span>Assistente do CareTEA</span>
              </div>

              <button
                type="button"
                className="care-chat-close"
                onClick={() => setChatAberto(false)}
                aria-label="Fechar conversa"
              >
                ✕
              </button>
            </header>

            <div className="care-chat-messages" aria-live="polite">
              {mensagens.map((item) => (
                <div
                  key={item.id}
                  className={`care-message care-message-${item.autor}`}
                >
                  {item.autor === "care" && (
                    <span className="care-message-avatar">✦</span>
                  )}

                  <div>{item.texto}</div>
                </div>
              ))}
            </div>

            <form className="care-chat-form" onSubmit={enviarMensagem}>
              <input
                value={mensagem}
                onChange={(event) => setMensagem(event.target.value)}
                placeholder="Digite uma mensagem..."
                aria-label="Mensagem para a Care"
              />

              <button
                type="submit"
                disabled={!mensagem.trim()}
                aria-label="Enviar mensagem"
              >
                ➤
              </button>
            </form>
          </section>
        )}
      </main>

      <footer className="autista-footer">
        <div className="autista-puzzle-strip" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <span
              key={index}
              className={`autista-puzzle-color autista-puzzle-color-${
                index % 5
              }`}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}

export default DashboardAutista;
