import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Topbar from "../../components/Topbar/Topbar.jsx";
import PuzzleStrip from "../../components/PuzzleStrip/PuzzleStrip.jsx";

import {
  getCareteaSession,
  getCareteaProfile,
  clearCareteaSession,
} from "../../utils/careteaSession.js";
import { API_URL } from "../../services/api.js";

import "./BemEstar.css";

const moods = [
  {
    emoji: "😊",
    label: "Muito bem",
    value: "muito-bem",
    backendValue: "MUITO_BEM",
  },
  {
    emoji: "🙂",
    label: "Bem",
    value: "bem",
    backendValue: "BEM",
  },
  {
    emoji: "😐",
    label: "Mais ou menos",
    value: "mais-ou-menos",
    backendValue: "NEUTRO",
  },
  {
    emoji: "🙁",
    label: "Mal",
    value: "mal",
    backendValue: "MAL",
  },
  {
    emoji: "😣",
    label: "Muito mal",
    value: "muito-mal",
    backendValue: "MUITO_MAL",
  },
];

const discomfortOptions = [
  "Barulho",
  "Luz",
  "Ansiedade",
  "Irritação",
  "Cansaço",
  "Tristeza",
  "Dor",
  "Não sei",
];

const moodEmoji = {
  MUITO_BEM: "😊",
  BEM: "🙂",
  NEUTRO: "😐",
  MAL: "🙁",
  MUITO_MAL: "😣",
};

function formatLocalDateTime(date) {
  const pad = (value) =>
    String(value).padStart(2, "0");

  return (
    `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())}T` +
    `${pad(date.getHours())}:` +
    `${pad(date.getMinutes())}:` +
    `${pad(date.getSeconds())}`
  );
}

function BemEstar({ onLogout }) {
  const session =
    getCareteaSession();

  const profile =
    getCareteaProfile();

  const userName =
    profile?.userName ||
    session?.userName ||
    "Usuário";

  const [
    selectedMood,
    setSelectedMood,
  ] = useState("bem");

  const [
    selectedDiscomforts,
    setSelectedDiscomforts,
  ] = useState([]);

  const [
    energy,
    setEnergy,
  ] = useState(3);

  const [
    anxiety,
    setAnxiety,
  ] = useState(3);

  const [
    sleepQuality,
    setSleepQuality,
  ] = useState(3);

  const [
    sensoryOverload,
    setSensoryOverload,
  ] = useState(3);

  const [
    note,
    setNote,
  ] = useState("");

  const [
    saved,
    setSaved,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    history,
    setHistory,
  ] = useState([]);

  const [
    loadingHistory,
    setLoadingHistory,
  ] = useState(true);

  const [
    historyError,
    setHistoryError,
  ] = useState("");

  const [
    showFullHistory,
    setShowFullHistory,
  ] = useState(false);

  const visibleHistory = showFullHistory
    ? history
    : history.slice(0, 5);

  const [
    analysis,
    setAnalysis,
  ] = useState(null);

  const [
    loadingAnalysis,
    setLoadingAnalysis,
  ] = useState(false);

  const [
    analysisError,
    setAnalysisError,
  ] = useState("");

  const selectedMoodData =
    useMemo(
      () =>
        moods.find(
          (item) =>
            item.value ===
            selectedMood,
        ),
      [selectedMood],
    );

  useEffect(() => {
    async function carregarHistorico() {
      setLoadingHistory(true);
      setHistoryError("");

      if (
        !session?.token ||
        !session?.userId
      ) {
        setHistoryError(
          "Não foi possível carregar o histórico de bem-estar.",
        );
        setLoadingHistory(false);
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/bem-estar/usuario/${session.userId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${session.token}`,
              },
            },
          );

        if (!response.ok) {
          throw new Error(
            "Não foi possível carregar o histórico.",
          );
        }

        const dados =
          await response.json();

        if (!Array.isArray(dados)) {
          throw new Error("Resposta de histórico inválida.");
        }

        setHistory(dados);
      } catch (error) {
        setHistoryError(
          "Não foi possível carregar o histórico de bem-estar.",
        );
        console.error(
          "Erro ao carregar histórico:",
          error,
        );
      } finally {
        setLoadingHistory(false);
      }
    }

    carregarHistorico();
  }, [
    session?.token,
    session?.userId,
  ]);

  function toggleDiscomfort(option) {
    setSaved(false);

    setSelectedDiscomforts(
      (current) =>
        current.includes(option)
          ? current.filter(
              (item) =>
                item !== option,
            )
          : [
              ...current,
              option,
            ],
    );
  }

  function montarObservacao() {
    const partes = [];

    if (
      selectedDiscomforts.length > 0
    ) {
      partes.push(
        `Incômodos: ${selectedDiscomforts.join(
          ", ",
        )}`,
      );
    }

    if (note.trim()) {
      partes.push(
        `Observação: ${note.trim()}`,
      );
    }

    return partes.join(" | ");
  }

  function formatarDia(dataHora) {
    if (!dataHora) {
      return "";
    }

    return new Intl.DateTimeFormat(
      "pt-BR",
      {
        weekday: "short",
      },
    )
      .format(
        new Date(dataHora),
      )
      .replace(".", "");
  }

  async function saveWellbeing(event) {
    event.preventDefault();

    if (saving) {
      return;
    }

    if (
      !session?.token ||
      !session?.userId
    ) {
      window.alert(
        "Sua sessão não foi encontrada. Faça login novamente.",
      );

      return;
    }

    if (!selectedMoodData) {
      window.alert(
        "Escolha como você está se sentindo.",
      );

      return;
    }

    try {
      setSaving(true);
      setSaved(false);

      const response =
        await fetch(
          `${API_URL}/bem-estar`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${session.token}`,
            },

            body: JSON.stringify({
              usuarioId:
                session.userId,

              humor:
                selectedMoodData.backendValue,

              ansiedade:
                anxiety * 2,

              energia:
                energy * 2,

              qualidadeSono:
                sleepQuality * 2,

              horasSono:
                null,

              sobrecargaSensorial:
                sensoryOverload * 2,

              observacao:
                montarObservacao(),
            }),
          },
        );

      if (
        response.status === 401
      ) {
        throw new Error(
          "Sua sessão expirou. Faça login novamente.",
        );
      }

      if (
        response.status === 403
      ) {
        throw new Error(
          "Você não tem permissão para registrar o bem-estar.",
        );
      }

      if (!response.ok) {
        throw new Error(
          "Não foi possível salvar seu registro de bem-estar.",
        );
      }

      const registroSalvo =
        await response.json();

      setHistory(
        (current) => [
          registroSalvo,

          ...current.filter(
            (item) =>
              item.id !==
              registroSalvo.id,
          ),
        ],
      );

      setAnalysis(null);
      setAnalysisError("");
      setSaved(true);
    } catch (error) {
      console.error(
        "Erro ao salvar bem-estar:",
        error,
      );

      window.alert(
        error instanceof TypeError
          ? "Não foi possível conectar ao servidor."
          : error.message ||
              "Não foi possível salvar o registro.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function analisarBemEstar() {
    if (
      !session?.token ||
      !session?.userId
    ) {
      window.alert(
        "Sua sessão não foi encontrada. Faça login novamente.",
      );

      return;
    }

    try {
      setLoadingAnalysis(true);
      setAnalysisError("");

      const fim =
        new Date();

      const inicio =
        new Date();

      inicio.setDate(
        inicio.getDate() - 7,
      );

      const inicioFormatado =
        formatLocalDateTime(
          inicio,
        );

      const fimFormatado =
        formatLocalDateTime(
          fim,
        );

      const response =
        await fetch(
          `${API_URL}/ia/bem-estar/usuario/${session.userId}` +
            `?inicio=${encodeURIComponent(
              inicioFormatado,
            )}` +
            `&fim=${encodeURIComponent(
              fimFormatado,
            )}`,
          {
            headers: {
              Authorization:
                `Bearer ${session.token}`,
            },
          },
        );

      if (
        response.status === 401
      ) {
        throw new Error(
          "Sua sessão expirou. Faça login novamente.",
        );
      }

      if (
        response.status === 403
      ) {
        throw new Error(
          "Você não tem permissão para acessar esta análise.",
        );
      }

      if (!response.ok) {
        throw new Error(
          "Não foi possível gerar a análise da Care.",
        );
      }

      const dados =
        await response.json();

      setAnalysis(
        dados,
      );
    } catch (error) {
      console.error(
        "Erro ao gerar análise:",
        error,
      );

      setAnalysisError(
        error instanceof TypeError
          ? "Não foi possível conectar ao servidor."
          : error.message ||
              "Não foi possível gerar a análise.",
      );
    } finally {
      setLoadingAnalysis(false);
    }
  }

  function handleLogout() {
    clearCareteaSession();

    if (onLogout) {
      onLogout();
    }
  }

  return (
    <div className="caretea-dashboard bem-estar-page">
      <Sidebar />

      <div className="bem-estar-content">
        <main className="bem-estar-main">
          <Topbar
            title={`Olá, ${userName}! 👋`}
            subtitle="Este espaço é seu. Registre como você está se sentindo hoje."
            onLogout={
              onLogout
                ? handleLogout
                : undefined
            }
          />

          <section className="bem-estar-hero">
            <div>
              <span>
                Seu bem-estar
              </span>

              <h1>
                Como você está hoje?
              </h1>

              <p>
                Não existe resposta certa.
                Escolha o que mais combina
                com o seu momento.
              </p>
            </div>

            <div className="bem-estar-current">
              <small>
                Agora
              </small>

              <strong>
                {
                  selectedMoodData
                    ?.emoji
                }
              </strong>

              <span>
                {
                  selectedMoodData
                    ?.label
                }
              </span>
            </div>
          </section>

          <form
            className="bem-estar-form"
            onSubmit={
              saveWellbeing
            }
          >
            <section className="bem-estar-card">
              <header>
                <div className="bem-estar-step">
                  1
                </div>

                <div>
                  <h2>
                    Como está seu
                    humor?
                  </h2>

                  <p>
                    Toque na opção que
                    representa melhor
                    como você se sente.
                  </p>
                </div>
              </header>

              <div className="bem-estar-moods">
                {moods.map(
                  (mood) => (
                    <button
                      key={
                        mood.value
                      }
                      type="button"
                      className={
                        selectedMood ===
                        mood.value
                          ? "selected"
                          : ""
                      }
                      onClick={() => {
                        setSelectedMood(
                          mood.value,
                        );

                        setSaved(
                          false,
                        );
                      }}
                    >
                      <span>
                        {
                          mood.emoji
                        }
                      </span>

                      <strong>
                        {
                          mood.label
                        }
                      </strong>
                    </button>
                  ),
                )}
              </div>
            </section>

            <section className="bem-estar-card">
              <header>
                <div className="bem-estar-step">
                  2
                </div>

                <div>
                  <h2>
                    Tem alguma coisa
                    te incomodando?
                  </h2>

                  <p>
                    Você pode escolher
                    mais de uma opção
                    ou nenhuma.
                  </p>
                </div>
              </header>

              <div className="bem-estar-tags">
                {discomfortOptions.map(
                  (option) => (
                    <button
                      key={
                        option
                      }
                      type="button"
                      className={
                        selectedDiscomforts.includes(
                          option,
                        )
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        toggleDiscomfort(
                          option,
                        )
                      }
                    >
                      {option}
                    </button>
                  ),
                )}
              </div>
            </section>

            <section className="bem-estar-card bem-estar-energy-card">
              <header>
                <div className="bem-estar-step">
                  3
                </div>

                <div>
                  <h2>
                    Como está sua
                    energia?
                  </h2>

                  <p>
                    De pouca energia
                    até muita energia.
                  </p>
                </div>
              </header>

              <div className="bem-estar-energy">
                <span>
                  Pouca
                </span>

                {[
                  1,
                  2,
                  3,
                  4,
                  5,
                ].map(
                  (value) => (
                    <button
                      key={value}
                      type="button"
                      className={
                        energy ===
                        value
                          ? "selected"
                          : ""
                      }
                      onClick={() => {
                        setEnergy(
                          value,
                        );

                        setSaved(
                          false,
                        );
                      }}
                    >
                      {value}
                    </button>
                  ),
                )}

                <span>
                  Muita
                </span>
              </div>
            </section>

            <section className="bem-estar-card bem-estar-energy-card">
              <header>
                <div className="bem-estar-step">
                  4
                </div>

                <div>
                  <h2>
                    Como está sua
                    ansiedade?
                  </h2>

                  <p>
                    De pouca ansiedade
                    até muita ansiedade.
                  </p>
                </div>
              </header>

              <div className="bem-estar-energy">
                <span>
                  Pouca
                </span>

                {[
                  1,
                  2,
                  3,
                  4,
                  5,
                ].map(
                  (value) => (
                    <button
                      key={value}
                      type="button"
                      className={
                        anxiety ===
                        value
                          ? "selected"
                          : ""
                      }
                      onClick={() => {
                        setAnxiety(
                          value,
                        );

                        setSaved(
                          false,
                        );
                      }}
                    >
                      {value}
                    </button>
                  ),
                )}

                <span>
                  Muita
                </span>
              </div>
            </section>

            <section className="bem-estar-card bem-estar-energy-card">
              <header>
                <div className="bem-estar-step">
                  5
                </div>

                <div>
                  <h2>
                    Como foi seu sono?
                  </h2>

                  <p>
                    De ruim até muito
                    bom.
                  </p>
                </div>
              </header>

              <div className="bem-estar-energy">
                <span>
                  Ruim
                </span>

                {[
                  1,
                  2,
                  3,
                  4,
                  5,
                ].map(
                  (value) => (
                    <button
                      key={value}
                      type="button"
                      className={
                        sleepQuality ===
                        value
                          ? "selected"
                          : ""
                      }
                      onClick={() => {
                        setSleepQuality(
                          value,
                        );

                        setSaved(
                          false,
                        );
                      }}
                    >
                      {value}
                    </button>
                  ),
                )}

                <span>
                  Muito bom
                </span>
              </div>
            </section>

            <section className="bem-estar-card bem-estar-energy-card">
              <header>
                <div className="bem-estar-step">
                  6
                </div>

                <div>
                  <h2>
                    Como está sua
                    sobrecarga
                    sensorial?
                  </h2>

                  <p>
                    Pense em barulho,
                    luz, movimento e
                    outros estímulos.
                  </p>
                </div>
              </header>

              <div className="bem-estar-energy">
                <span>
                  Baixa
                </span>

                {[
                  1,
                  2,
                  3,
                  4,
                  5,
                ].map(
                  (value) => (
                    <button
                      key={value}
                      type="button"
                      className={
                        sensoryOverload ===
                        value
                          ? "selected"
                          : ""
                      }
                      onClick={() => {
                        setSensoryOverload(
                          value,
                        );

                        setSaved(
                          false,
                        );
                      }}
                    >
                      {value}
                    </button>
                  ),
                )}

                <span>
                  Alta
                </span>
              </div>
            </section>

            <section className="bem-estar-card">
              <header>
                <div className="bem-estar-step">
                  7
                </div>

                <div>
                  <h2>
                    Quer contar alguma
                    coisa?
                  </h2>

                  <p>
                    Este campo é
                    opcional. Escreva
                    do seu jeito.
                  </p>
                </div>
              </header>

              <textarea
                value={note}
                onChange={(
                  event,
                ) => {
                  setNote(
                    event.target
                      .value,
                  );

                  setSaved(
                    false,
                  );
                }}
                placeholder="Ex.: Hoje fiquei cansado depois da aula, mas agora estou melhor..."
                maxLength={500}
              />

              <small className="bem-estar-counter">
                {note.length}/500
              </small>
            </section>

            <button
              className="bem-estar-save"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Salvando..."
                : "Salvar como estou me sentindo"}
            </button>

            {saved && (
              <div
                className="bem-estar-saved"
                role="status"
              >
                <span>
                  ✓
                </span>

                <div>
                  <strong>
                    Seu registro foi
                    salvo.
                  </strong>

                  <p>
                    Humor:{" "}
                    {
                      selectedMoodData
                        ?.label
                    }

                    {selectedDiscomforts.length
                      ? ` · Incômodos: ${selectedDiscomforts.join(
                          ", ",
                        )}`
                      : ""}

                    {" · "}
                    Energia:{" "}
                    {energy}/5
                  </p>
                </div>
              </div>
            )}
          </form>

          <section className="bem-estar-history">
            <header>
              <div>
                <span>
                  Histórico recente
                </span>

                <h2>
                  Como foram seus
                  últimos dias
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFullHistory((current) => !current)
                }
                disabled={
                  loadingHistory ||
                  Boolean(historyError) ||
                  history.length <= 5
                }
              >
                {showFullHistory
                  ? "Mostrar menos"
                  : "Ver histórico completo"}
              </button>
            </header>

            <div className="bem-estar-days">
              {loadingHistory ? (
                <p>
                  Carregando
                  histórico...
                </p>
              ) : historyError ? (
                <p role="alert">{historyError}</p>
              ) : history.length ===
                0 ? (
                <p>
                  Nenhum registro de
                  bem-estar ainda.
                </p>
              ) : (
                visibleHistory.map(
                  (registro) => (
                    <article
                      key={
                        registro.id
                      }
                    >
                      <span>
                        {moodEmoji[
                          registro.humor
                        ] || "😐"}
                      </span>

                      <strong>
                        {formatarDia(
                          registro.registradoEm,
                        )}
                      </strong>
                    </article>
                  ),
                )
              )}
            </div>
          </section>

          <section className="bem-estar-card">
            <header>
              <div className="bem-estar-step">
                ✦
              </div>

              <div>
                <h2>
                  Análise da Care
                </h2>

                <p>
                  A Care pode analisar
                  seus registros dos
                  últimos 7 dias e
                  ajudar você a
                  perceber padrões no
                  seu bem-estar.
                </p>
              </div>
            </header>

            <button
              className="bem-estar-save"
              type="button"
              onClick={
                analisarBemEstar
              }
              disabled={
                loadingAnalysis
              }
            >
              {loadingAnalysis
                ? "Care está analisando..."
                : analysis
                  ? "Analisar novamente"
                  : "Analisar meus últimos 7 dias"}
            </button>

            {analysisError && (
              <div
                className="bem-estar-saved"
                role="alert"
              >
                <span>
                  !
                </span>

                <div>
                  <strong>
                    Não foi possível
                    gerar a análise.
                  </strong>

                  <p>
                    {
                      analysisError
                    }
                  </p>
                </div>
              </div>
            )}

            {analysis && (
              <div className="bem-estar-analysis">
                <div className="bem-estar-analysis-block">
                  <strong>
                    💜 O que a Care
                    percebeu
                  </strong>

                  <p>
                    {
                      analysis.resumo
                    }
                  </p>
                </div>

                {analysis
                  .pontosPositivos
                  ?.length > 0 && (
                  <div className="bem-estar-analysis-block">
                    <strong>
                      Pontos positivos
                    </strong>

                    <ul>
                      {analysis.pontosPositivos.map(
                        (
                          item,
                          index,
                        ) => (
                          <li
                            key={`positivo-${index}`}
                          >
                            {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {analysis
                  .pontosAtencao
                  ?.length > 0 && (
                  <div className="bem-estar-analysis-block">
                    <strong>
                      Vale observar
                    </strong>

                    <ul>
                      {analysis.pontosAtencao.map(
                        (
                          item,
                          index,
                        ) => (
                          <li
                            key={`atencao-${index}`}
                          >
                            {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {analysis
                  .recomendacoes
                  ?.length > 0 && (
                  <div className="bem-estar-analysis-block">
                    <strong>
                      Sugestões da
                      Care
                    </strong>

                    <ul>
                      {analysis.recomendacoes.map(
                        (
                          item,
                          index,
                        ) => (
                          <li
                            key={`recomendacao-${index}`}
                          >
                            {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {analysis
                  .observacaoSeguranca && (
                  <small className="bem-estar-analysis-warning">
                    {
                      analysis.observacaoSeguranca
                    }
                  </small>
                )}
              </div>
            )}
          </section>
        </main>

        <PuzzleStrip />
      </div>
    </div>
  );
}

export default BemEstar;