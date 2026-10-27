import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  clearMeuDiaSession,
  getMeuDiaSession,
} from "../../utils/meuDiaSession.js";

import "./DashboardMeuDia.css";

const API_URL = "http://localhost:8080";

function periodoDoHorario(horario) {
  if (!horario) return "";

  const hora = Number(
    String(horario).split(":")[0],
  );

  if (hora < 12) return "Manhã";
  if (hora < 18) return "Tarde";

  return "Noite";
}

function formatarHorario(dataHora) {
  if (!dataHora) return "";

  const data = new Date(dataHora);

  if (Number.isNaN(data.getTime())) {
    return "";
  }

  return data.toLocaleTimeString(
    "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

function formatarDia(dataHora) {
  if (!dataHora) return "--";

  const data = new Date(dataHora);

  if (Number.isNaN(data.getTime())) {
    return "--";
  }

  return String(
    data.getDate(),
  ).padStart(2, "0");
}

function formatarMes(dataHora) {
  if (!dataHora) return "---";

  const data = new Date(dataHora);

  if (Number.isNaN(data.getTime())) {
    return "---";
  }

  return data
    .toLocaleDateString(
      "pt-BR",
      {
        month: "short",
      },
    )
    .replace(".", "")
    .toUpperCase();
}

function responderCare(
  texto,
  painel,
) {
  const mensagem =
    texto.toLowerCase();

  const nome =
    painel?.nomePessoaAutista ||
    "você";

  if (
    mensagem.includes("remédio") ||
    mensagem.includes("remedio") ||
    mensagem.includes("medicamento")
  ) {
    if (
      !painel?.medicamentos?.length
    ) {
      return "Não há medicamentos disponíveis no seu Meu Dia neste momento.";
    }

    const lista =
      painel.medicamentos
        .map(
          (medicamento) =>
            `${medicamento.nome} às ${medicamento.horario}`,
        )
        .join(", ");

    return `Seus medicamentos de hoje são: ${lista}.`;
  }

  if (
    mensagem.includes("consulta") ||
    mensagem.includes("médico") ||
    mensagem.includes("medico") ||
    mensagem.includes("compromisso")
  ) {
    const compromisso =
      painel?.compromissos?.[0];

    if (!compromisso) {
      return "Você não tem compromissos cadastrados para hoje.";
    }

    const horario =
      formatarHorario(
        compromisso.dataHora,
      );

    return `${compromisso.titulo}${
      horario
        ? ` às ${horario}`
        : ""
    }.`;
  }

  if (
    mensagem.includes("mal") ||
    mensagem.includes("triste") ||
    mensagem.includes("ansiosa") ||
    mensagem.includes("ansioso") ||
    mensagem.includes("nervosa") ||
    mensagem.includes("nervoso")
  ) {
    return "Entendi. Você pode me contar um pouco mais sobre como está se sentindo. Se precisar, também pode usar o botão “Preciso de ajuda”.";
  }

  if (
    mensagem.includes("oi") ||
    mensagem.includes("olá") ||
    mensagem.includes("ola")
  ) {
    return `Oi, ${nome}! 💜 Estou aqui com você. Quer falar sobre sua rotina, medicamentos ou como está se sentindo?`;
  }

  return "Entendi 💜 Pode continuar me contando.";
}

function DashboardAutista() {
  const navigate = useNavigate();

  const [painel, setPainel] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [erro, setErro] =
    useState("");

  const [humor, setHumor] =
    useState("");

  const [
    salvandoHumor,
    setSalvandoHumor,
  ] = useState(false);

  const [
    feedbackHumor,
    setFeedbackHumor,
  ] = useState("");

  const [
    pedindoAjuda,
    setPedindoAjuda,
  ] = useState(false);

  const [
    feedbackAjuda,
    setFeedbackAjuda,
  ] = useState(null);

  const [chatAberto, setChatAberto] =
    useState(false);

  const [mensagem, setMensagem] =
    useState("");

  const [mensagens, setMensagens] =
    useState([]);

  useEffect(() => {
    carregarPainel();
  }, []);

  useEffect(() => {
    if (feedbackAjuda?.tipo !== "sucesso") {
      return;
    }

    const timeoutId =
      window.setTimeout(
        () => setFeedbackAjuda(null),
        4000,
      );

    return () =>
      window.clearTimeout(timeoutId);
  }, [feedbackAjuda]);

  useEffect(() => {
    if (
      painel?.nomePessoaAutista &&
      mensagens.length === 0
    ) {
      setMensagens([
        {
          id: 1,
          autor: "care",
          texto: `Oi, ${painel.nomePessoaAutista}! 💜 Como posso te ajudar hoje?`,
        },
      ]);
    }
  }, [
    painel?.nomePessoaAutista,
    mensagens.length,
  ]);

  async function readError(response) {
    try {
      const data =
        await response.json();

      return (
        data?.message ||
        data?.error ||
        "Não foi possível concluir a operação."
      );
    } catch {
      return "Não foi possível concluir a operação.";
    }
  }

  function sairMeuDia() {
    clearMeuDiaSession();

    navigate(
      "/acesso-meu-dia",
      {
        replace: true,
      },
    );
  }

  async function carregarPainel() {
    const session =
      getMeuDiaSession();

    if (!session?.token) {
      navigate(
        "/acesso-meu-dia",
        {
          replace: true,
        },
      );

      return;
    }

    setLoading(true);
    setErro("");

    try {
      const response =
        await fetch(
          `${API_URL}/meu-dia/painel`,
          {
            headers: {
              "X-Meu-Dia-Token":
                session.token,
            },
          },
        );

      if (response.status === 401) {
        clearMeuDiaSession();

        navigate(
          "/acesso-meu-dia",
          {
            replace: true,
          },
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          await readError(response),
        );
      }

      const data =
        await response.json();

      setPainel(data);

      setHumor(
        data.humorHoje || "",
      );
    } catch (error) {
      setErro(
        error.message ||
          "Não foi possível carregar o Meu Dia.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function registrarHumor(
    novoHumor,
  ) {
    const session =
      getMeuDiaSession();

    if (!session?.token) {
      sairMeuDia();
      return;
    }

    setSalvandoHumor(true);
    setFeedbackHumor("");

    try {
      const response =
        await fetch(
          `${API_URL}/meu-dia/humor`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              "X-Meu-Dia-Token":
                session.token,
            },

            body: JSON.stringify({
              humor: novoHumor,
            }),
          },
        );

      if (response.status === 401) {
        sairMeuDia();
        return;
      }

      if (!response.ok) {
        throw new Error(
          await readError(response),
        );
      }

      setHumor(novoHumor);

      setPainel(
        (atual) =>
          atual
            ? {
                ...atual,
                humorHoje:
                  novoHumor,
              }
            : atual,
      );

      setFeedbackHumor(
        "Obrigado por contar como você está.",
      );
    } catch (error) {
      setFeedbackHumor(
        error.message ||
          "Não foi possível registrar como você está.",
      );
    } finally {
      setSalvandoHumor(false);
    }
  }

  async function confirmarMedicamento(
    medicamentoId,
  ) {
    const session =
      getMeuDiaSession();

    if (!session?.token) {
      sairMeuDia();
      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/meu-dia/medicamentos/${medicamentoId}/confirmar`,
          {
            method: "POST",

            headers: {
              "X-Meu-Dia-Token":
                session.token,
            },
          },
        );

      if (response.status === 401) {
        sairMeuDia();
        return;
      }

      if (!response.ok) {
        throw new Error(
          await readError(response),
        );
      }

      setPainel((atual) => ({
        ...atual,

        medicamentos:
          atual.medicamentos.map(
            (medicamento) =>
              medicamento.id ===
              medicamentoId
                ? {
                    ...medicamento,
                    tomadoHoje: true,
                  }
                : medicamento,
          ),
      }));
    } catch (error) {
      alert(
        error.message ||
          "Não foi possível confirmar o medicamento.",
      );
    }
  }

  async function pedirAjuda() {
    const session =
      getMeuDiaSession();

    if (!session?.token) {
      sairMeuDia();
      return;
    }

    setFeedbackAjuda(null);
    setPedindoAjuda(true);

    try {
      const response =
        await fetch(
          `${API_URL}/meu-dia/ajuda`,
          {
            method: "POST",

            headers: {
              "X-Meu-Dia-Token":
                session.token,
            },
          },
        );

      if (response.status === 401) {
        sairMeuDia();
        return;
      }

      if (!response.ok) {
        throw new Error(
          await readError(response),
        );
      }

      setFeedbackAjuda({
        tipo: "sucesso",
        mensagem:
          "Pedido enviado! Notificamos seu responsável.",
      });
    } catch {
      setFeedbackAjuda({
        tipo: "erro",
        mensagem:
          "Não foi possível avisar seu responsável. Tente novamente.",
      });
    } finally {
      setPedindoAjuda(false);
    }
  }

  function enviarMensagem(event) {
    event.preventDefault();

    const texto =
      mensagem.trim();

    if (!texto) {
      return;
    }

    const novaMensagem = {
      id: Date.now(),
      autor: "usuario",
      texto,
    };

    setMensagens(
      (atuais) => [
        ...atuais,
        novaMensagem,
      ],
    );

    setMensagem("");

    window.setTimeout(() => {
      const resposta =
        responderCare(
          texto,
          painel,
        );

      setMensagens(
        (atuais) => [
          ...atuais,
          {
            id:
              Date.now() + 1,

            autor: "care",
            texto: resposta,
          },
        ],
      );
    }, 350);
  }

  if (loading) {
    return (
      <div className="autista-page">
        <main className="autista-main">
          <section className="care-section">
            <div className="section-heading">
              <div>
                <h2>
                  Carregando Meu Dia...
                </h2>

                <p>
                  Buscando suas informações.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="autista-page">
        <main className="autista-main">
          <section className="care-section">
            <div className="section-heading">
              <div>
                <h2>
                  Não foi possível abrir o Meu Dia
                </h2>

                <p>{erro}</p>
              </div>
            </div>

            <button
              type="button"
              className="taken-button"
              onClick={carregarPainel}
            >
              Tentar novamente
            </button>
          </section>
        </main>
      </div>
    );
  }

  const nome =
    painel?.nomePessoaAutista ||
    "Meu Dia";

  const medicamentos =
    painel?.medicamentos || [];

  const compromissos =
    painel?.compromissos || [];

  const proximoCompromisso =
    compromissos[0] || null;

  return (
    <div className="autista-page">
      <main className="autista-main">
        <div className="autista-brand">
          <div
            className="brand-colors"
            aria-hidden="true"
          >
            <span className="brand-color brand-blue" />
            <span className="brand-color brand-purple" />
            <span className="brand-color brand-yellow" />
            <span className="brand-color brand-green" />
            <span className="brand-color brand-red" />
          </div>

          <span className="brand-name">
            Care<span>TEA</span>
          </span>
        </div>

        <header className="welcome-card">
          <div className="welcome-circle welcome-circle-one" />
          <div className="welcome-circle welcome-circle-two" />

          <div className="welcome-content">
            <span className="welcome-label">
              Meu dia
            </span>

            <h1>
              Olá, {nome}!{" "}
              <span className="wave">
                👋
              </span>
            </h1>

            <p>
              Aqui está tudo o que você precisa
              saber hoje.
            </p>
          </div>

          <div className="welcome-profile">
            {nome
              .charAt(0)
              .toUpperCase()}
          </div>
        </header>

        <section className="care-section mood-section">
          <div className="section-heading">
            <div className="section-icon mood-icon">
              ☺
            </div>

            <div>
              <h2>
                Como você está hoje?
              </h2>

              <p>
                Escolha como você está se
                sentindo agora.
              </p>
            </div>
          </div>

          <div className="mood-options">
            <button
              type="button"
              disabled={salvandoHumor}
              aria-pressed={
                humor === "BEM"
              }
              className={`mood-option ${
                humor === "BEM"
                  ? "selected mood-good"
                  : ""
              }`}
              onClick={() =>
                registrarHumor(
                  "BEM",
                )
              }
            >
              <span className="mood-face">
                😊
              </span>

              <strong>
                Estou bem
              </strong>
            </button>

            <button
              type="button"
              disabled={salvandoHumor}
              aria-pressed={
                humor === "NEUTRO"
              }
              className={`mood-option ${
                humor === "NEUTRO"
                  ? "selected mood-medium"
                  : ""
              }`}
              onClick={() =>
                registrarHumor(
                  "NEUTRO",
                )
              }
            >
              <span className="mood-face">
                😐
              </span>

              <strong>
                Mais ou menos
              </strong>
            </button>

            <button
              type="button"
              disabled={salvandoHumor}
              aria-pressed={
                humor === "MAL"
              }
              className={`mood-option ${
                humor === "MAL"
                  ? "selected mood-bad"
                  : ""
              }`}
              onClick={() =>
                registrarHumor(
                  "MAL",
                )
              }
            >
              <span className="mood-face">
                😣
              </span>

              <strong>
                Não estou bem
              </strong>
            </button>
          </div>

          {(humor ||
            feedbackHumor) && (
            <div className="mood-confirmation">
              <span>✓</span>

              {feedbackHumor ||
                "Obrigado por contar como você está."}
            </div>
          )}
        </section>

        <section className="care-section medication-section">
          <div className="section-accent medication-accent" />

          <div className="section-heading">
            <div className="section-icon medication-icon">
              💊
            </div>

            <div>
              <span className="section-label">
                Sua rotina
              </span>

              <h2>
                Medicamentos de hoje
              </h2>

              <p>
                Veja os medicamentos e os
                horários de hoje.
              </p>
            </div>
          </div>

          <div className="medication-list">
            {medicamentos.length ===
            0 ? (
              <article className="medication-item">
                <div className="medication-main-info">
                  <h3>
                    Nenhum medicamento disponível
                  </h3>

                  <span className="medication-dose">
                    Quando houver medicamentos
                    cadastrados para hoje, eles
                    aparecerão aqui.
                  </span>
                </div>
              </article>
            ) : (
              medicamentos.map(
                (medicamento) => {
                  const tomado =
                    Boolean(
                      medicamento.tomadoHoje,
                    );

                  return (
                    <article
                      className={`medication-item ${
                        tomado
                          ? "medication-item-taken"
                          : ""
                      }`}
                      key={
                        medicamento.id
                      }
                    >
                      <div className="medication-item-top">
                        <div className="medication-main-info">
                          <span className="medication-period">
                            {periodoDoHorario(
                              medicamento.horario,
                            )}
                          </span>

                          <h3>
                            {
                              medicamento.nome
                            }
                          </h3>

                          <span className="medication-dose">
                            {medicamento.dosagem ||
                              "Dose não informada"}
                          </span>

                          {medicamento.observacoes && (
                            <span className="medication-dose">
                              {
                                medicamento.observacoes
                              }
                            </span>
                          )}
                        </div>

                        <div className="medication-time">
                          <span className="clock-icon">
                            ◷
                          </span>

                          <strong>
                            {
                              medicamento.horario
                            }
                          </strong>
                        </div>
                      </div>

                      {!tomado ? (
                        <button
                          type="button"
                          className="taken-button"
                          onClick={() =>
                            confirmarMedicamento(
                              medicamento.id,
                            )
                          }
                        >
                          <span className="check-circle">
                            ✓
                          </span>

                          Já tomei
                        </button>
                      ) : (
                        <div className="taken-confirmation">
                          <span className="taken-check">
                            ✓
                          </span>

                          <div>
                            <strong>
                              Confirmado!
                            </strong>

                            <span>
                              Você marcou este
                              medicamento como
                              tomado.
                            </span>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                },
              )
            )}
          </div>
        </section>

        <section className="care-section appointment-section">
          <div className="section-accent appointment-accent" />

          <div className="section-heading">
            <div className="section-icon appointment-icon">
              📅
            </div>

            <div>
              <span className="section-label">
                Compromissos
              </span>

              <h2>
                {proximoCompromisso
                  ? proximoCompromisso.titulo
                  : "Nenhum compromisso hoje"}
              </h2>
            </div>
          </div>

          {proximoCompromisso && (
            <div className="appointment-info">
              <div className="appointment-date">
                <strong>
                  {formatarDia(
                    proximoCompromisso.dataHora,
                  )}
                </strong>

                <span>
                  {formatarMes(
                    proximoCompromisso.dataHora,
                  )}
                </span>
              </div>

              <div className="appointment-text">
                <strong>
                  {formatarHorario(
                    proximoCompromisso.dataHora,
                  )}
                </strong>

                <span>
                  {proximoCompromisso.detalhe ||
                    proximoCompromisso.tipo ||
                    "Compromisso do dia"}
                </span>
              </div>
            </div>
          )}
        </section>

        <section className="quick-actions">
          <button
            type="button"
            className="quick-action care-ai"
            aria-expanded={
              chatAberto
            }
            onClick={() =>
              setChatAberto(
                (aberto) =>
                  !aberto,
              )
            }
          >
            <div className="quick-icon care-icon">
              ✦
            </div>

            <div className="quick-text">
              <strong>
                Conversar com a Care
              </strong>

              <span>
                Quero conversar ou contar
                alguma coisa
              </span>
            </div>

            <span className="quick-arrow">
              {chatAberto
                ? "⌃"
                : "›"}
            </span>
          </button>

          <button
            type="button"
            className="quick-action care-help"
            onClick={pedirAjuda}
            disabled={pedindoAjuda}
          >
            <div className="quick-icon help-icon">
              ♡
            </div>

            <div className="quick-text">
              <strong>
                {pedindoAjuda
                  ? "Enviando..."
                  : feedbackAjuda?.tipo ===
                      "sucesso"
                    ? "Pedido enviado ✓"
                    : "Preciso de ajuda"}
              </strong>

              <span
                role={
                  feedbackAjuda
                    ? "status"
                    : undefined
                }
                aria-live="polite"
              >
                {feedbackAjuda?.mensagem ||
                  "Quero avisar meu responsável"}
              </span>
            </div>

            <span className="quick-arrow">
              ›
            </span>
          </button>
        </section>

        {chatAberto && (
          <section
            className="care-chat"
            aria-label="Conversa com a Care"
          >
            <header className="care-chat-header">
              <div className="care-chat-avatar">
                ✦
              </div>

              <div>
                <strong>
                  Care
                </strong>

                <span>
                  Assistente do CareTEA
                </span>
              </div>

              <button
                type="button"
                className="care-chat-close"
                onClick={() =>
                  setChatAberto(false)
                }
                aria-label="Fechar conversa"
              >
                ✕
              </button>
            </header>

            <div
              className="care-chat-messages"
              aria-live="polite"
            >
              {mensagens.map(
                (item) => (
                  <div
                    key={item.id}
                    className={`care-message care-message-${item.autor}`}
                  >
                    {item.autor ===
                      "care" && (
                      <span className="care-message-avatar">
                        ✦
                      </span>
                    )}

                    <div>
                      {item.texto}
                    </div>
                  </div>
                ),
              )}
            </div>

            <form
              className="care-chat-form"
              onSubmit={
                enviarMensagem
              }
            >
              <input
                value={mensagem}
                onChange={(
                  event,
                ) =>
                  setMensagem(
                    event.target.value,
                  )
                }
                placeholder="Digite uma mensagem..."
                aria-label="Mensagem para a Care"
              />

              <button
                type="submit"
                disabled={
                  !mensagem.trim()
                }
                aria-label="Enviar mensagem"
              >
                ➤
              </button>
            </form>
          </section>
        )}
      </main>

      <footer className="autista-footer">
        <div
          className="autista-puzzle-strip"
          aria-hidden="true"
        >
          {Array.from(
            { length: 18 },
            (_, index) => (
              <span
                key={index}
                className={`autista-puzzle-color autista-puzzle-color-${
                  index % 5
                }`}
              />
            ),
          )}
        </div>
      </footer>
    </div>
  );
}

export default DashboardAutista;