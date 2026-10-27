import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import PuzzleStrip from "../../components/PuzzleStrip/PuzzleStrip.jsx";
import PerfilAvatar from "../../components/PerfilAvatar/PerfilAvatar.jsx";
import ModalNotificacoes from "../../components/ModalNotificacoes/ModalNotificacoes.jsx";
import ModalPerfil from "../../components/ModalPerfil/ModalPerfil.jsx";

import {
  getCareteaProfile,
  getCareteaSession,
  clearCareteaSession,
} from "../../utils/careteaSession.js";

import "./Relatorios.css";

const cards = [
  [
    "◊",
    "—",
    "Adesão aos medicamentos",
    "Aguardando integração do módulo de medicamentos",
    "purple",
  ],
  [
    "▣",
    "—",
    "Consultas realizadas",
    "Aguardando integração do módulo de agenda",
    "blue",
  ],
  [
    "♡",
    "—",
    "Terapias realizadas",
    "Aguardando integração do módulo de agenda",
    "pink",
  ],
  [
    "△",
    "0",
    "Exames",
    "Nenhum exame registrado no período",
    "green",
  ],
];

const history = [
  [
    "—",
    "▣",
    "Agenda ainda não integrada",
    "Consultas e terapias aparecerão aqui após a integração",
    "Agenda",
    "blue",
  ],
  [
    "—",
    "◊",
    "Medicamentos ainda não integrados",
    "O histórico de doses aparecerá aqui após a integração",
    "Medicamento",
    "orange",
  ],
];

const routeMap = {
  dashboard: "/dashboard",
  agenda: "/agenda",
  medicamentos: "/medicamentos",
  consultas: "/consultas",
  "bem-estar": "/bem-estar",
  "gerenciar-meu-dia": "/gerenciar-meu-dia",
  assistente: "/assistente",
  notificacoes: "/notificacoes",
  documentos: "/documentos",
  relatorios: "/relatorios",
  configuracoes: "/configuracoes",
};

const API_URL = "http://localhost:8080";

function formatarData(data) {
  const ano = data.getFullYear();

  const mes = String(
    data.getMonth() + 1,
  ).padStart(2, "0");

  const dia = String(
    data.getDate(),
  ).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function calcularPeriodo(dias) {
  const fim = new Date();
  const inicio = new Date();

  inicio.setDate(
    fim.getDate() - (dias - 1),
  );

  return {
    inicio: formatarData(inicio),
    fim: formatarData(fim),
  };
}

function formatarHumor(humor) {
  const nomes = {
    MUITO_BEM: "Muito bem",
    OTIMO: "Ótimo",
    BEM: "Bem",
    MAIS_OU_MENOS: "Mais ou menos",
    NEUTRO: "Mais ou menos",
    MAL: "Mal",
    MUITO_MAL: "Muito mal",
  };

  return nomes[humor] || "Bem";
}

function Relatorios({
  onNavigate,
  onLogout,
}) {
  const navigate = useNavigate();

  const profile =
    getCareteaProfile();

  const session =
    getCareteaSession();

  const userId =
    session?.userId;

  const profileId =
    session?.profileId;

  const token =
    session?.token;

  const userName =
    profile?.userName ||
    "Usuário";

  const userLevel =
    profile?.userLevel ||
    "";

  const [
    periodo,
    setPeriodo,
  ] = useState("30");

  const [
    tipo,
    setTipo,
  ] = useState("geral");

  const [
    notificacoesAbertas,
    setNotificacoesAbertas,
  ] = useState(false);

  const [
    perfilAberto,
    setPerfilAberto,
  ] = useState(false);

  const [
    quantidadeNotificacoes,
    setQuantidadeNotificacoes,
  ] = useState(3);

  const [
    relatorio,
    setRelatorio,
  ] = useState(null);

  const [
    dataInicioPersonalizada,
    setDataInicioPersonalizada,
  ] = useState("");

  const [
    dataFimPersonalizada,
    setDataFimPersonalizada,
  ] = useState("");

  const [
    gerandoPdf,
    setGerandoPdf,
  ] = useState(false);

  const periodoTexto =
    periodo === "7"
      ? "Últimos 7 dias"
      : periodo === "90"
        ? "Últimos 90 dias"
        : periodo === "personalizado"
          ? dataInicioPersonalizada &&
            dataFimPersonalizada
            ? `${dataInicioPersonalizada} até ${dataFimPersonalizada}`
            : "Período personalizado"
          : "Últimos 30 dias";

  useEffect(() => {
    if (
      !userId ||
      !profileId ||
      !token
    ) {
      return;
    }

    if (
      periodo === "personalizado" &&
      (
        !dataInicioPersonalizada ||
        !dataFimPersonalizada
      )
    ) {
      return;
    }

    let ativo = true;

    async function carregarRelatorio() {
      const datas =
        periodo === "personalizado"
          ? {
              inicio:
                dataInicioPersonalizada,

              fim:
                dataFimPersonalizada,
            }
          : calcularPeriodo(
              Number(periodo),
            );

      try {
        const parametros =
          new URLSearchParams({
            usuarioId:
              String(userId),

            pessoaAutistaId:
              String(profileId),

            inicio:
              datas.inicio,

            fim:
              datas.fim,
          });

        const resposta =
          await fetch(
            `${API_URL}/relatorios/geral?${parametros.toString()}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          );

        if (!resposta.ok) {
          throw new Error(
            "Não foi possível carregar o relatório.",
          );
        }

        const dados =
          await resposta.json();

        if (ativo) {
          setRelatorio(
            dados,
          );
        }
      } catch (erro) {
        console.error(
          "Erro ao carregar relatório:",
          erro,
        );
      }
    }

    carregarRelatorio();

    return () => {
      ativo = false;
    };
  }, [
    periodo,
    dataInicioPersonalizada,
    dataFimPersonalizada,
    userId,
    profileId,
    token,
  ]);

  const cardsExibidos =
    cards.map(
      (
        card,
        index,
      ) => {
        if (
          index === 3 &&
          relatorio?.documentos
        ) {
          const totalExames =
            relatorio
              .documentos
              .exames ?? 0;

          return [
            card[0],

            String(
              totalExames,
            ),

            card[2],

            `${totalExames} exame${
              totalExames === 1
                ? ""
                : "s"
            } registrado${
              totalExames === 1
                ? ""
                : "s"
            } no período`,

            card[4],
          ];
        }

        return card;
      },
    );

  const humorMaisRegistrado =
    relatorio?.bemEstar
      ?.humorMaisRegistrado
      ? formatarHumor(
          relatorio
            .bemEstar
            .humorMaisRegistrado,
        )
      : "Bem";

  const bemEstar =
    relatorio?.bemEstar;

  const barrasBemEstar = [
    [
      "Ansiedade",

      (
        bemEstar
          ?.mediaAnsiedade ??
        0
      ) * 10,

      "orange",
    ],

    [
      "Energia",

      (
        bemEstar
          ?.mediaEnergia ??
        0
      ) * 10,

      "green",
    ],

    [
      "Qualidade sono",

      (
        bemEstar
          ?.mediaQualidadeSono ??
        0
      ) * 10,

      "yellow",
    ],

    [
      "Horas de sono",

      Math.min(
        (
          (
            bemEstar
              ?.mediaHorasSono ??
            0
          ) /
          12
        ) * 100,

        100,
      ),

      "blue",
    ],

    [
      "Sobrecarga",

      (
        bemEstar
          ?.mediaSobrecargaSensorial ??
        0
      ) * 10,

      "purple",
    ],
  ];

  function alterarPeriodo(
    valor,
  ) {
    if (
      valor !==
      "personalizado"
    ) {
      setPeriodo(valor);

      return;
    }

    const inicio =
      window.prompt(
        "Digite a data inicial (AAAA-MM-DD):",
        dataInicioPersonalizada,
      );

    if (!inicio) {
      return;
    }

    const fim =
      window.prompt(
        "Digite a data final (AAAA-MM-DD):",
        dataFimPersonalizada ||
          formatarData(
            new Date(),
          ),
      );

    if (!fim) {
      return;
    }

    const formatoData =
      /^\d{4}-\d{2}-\d{2}$/;

    if (
      !formatoData.test(
        inicio,
      ) ||
      !formatoData.test(
        fim,
      )
    ) {
      window.alert(
        "Use o formato AAAA-MM-DD.",
      );

      return;
    }

    if (inicio > fim) {
      window.alert(
        "A data inicial não pode ser posterior à data final.",
      );

      return;
    }

    setDataInicioPersonalizada(
      inicio,
    );

    setDataFimPersonalizada(
      fim,
    );

    setPeriodo(
      "personalizado",
    );
  }

  async function gerarPdf() {
    if (
      !userId ||
      !profileId ||
      !token
    ) {
      window.alert(
        "Não foi possível identificar o usuário.",
      );

      return;
    }

    if (
      periodo === "personalizado" &&
      (
        !dataInicioPersonalizada ||
        !dataFimPersonalizada
      )
    ) {
      window.alert(
        "Selecione o período personalizado primeiro.",
      );

      return;
    }

    const datas =
      periodo === "personalizado"
        ? {
            inicio:
              dataInicioPersonalizada,

            fim:
              dataFimPersonalizada,
          }
        : calcularPeriodo(
            Number(periodo),
          );

    setGerandoPdf(true);

    try {
      const parametros =
        new URLSearchParams({
          usuarioId:
            String(userId),

          pessoaAutistaId:
            String(profileId),

          inicio:
            datas.inicio,

          fim:
            datas.fim,
        });

      const resposta =
        await fetch(
          `${API_URL}/relatorios/pdf?${parametros.toString()}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

      if (!resposta.ok) {
        throw new Error(
          "Não foi possível gerar o PDF.",
        );
      }

      const arquivo =
        await resposta.blob();

      const url =
        URL.createObjectURL(
          arquivo,
        );

      const link =
        document.createElement(
          "a",
        );

      link.href = url;

      link.download =
        `relatorio-caretea-${datas.inicio}-${datas.fim}.pdf`;

      document.body.appendChild(
        link,
      );

      link.click();

      document.body.removeChild(
        link,
      );

      URL.revokeObjectURL(
        url,
      );
    } catch (erro) {
      console.error(
        "Erro ao gerar PDF:",
        erro,
      );

      window.alert(
        "Não foi possível gerar o PDF.",
      );
    } finally {
      setGerandoPdf(
        false,
      );
    }
  }

  function navegarPagina(
    id,
  ) {
    setPerfilAberto(
      false,
    );

    setNotificacoesAbertas(
      false,
    );

    if (onNavigate) {
      onNavigate(id);

      return;
    }

    const path =
      routeMap[id];

    if (path) {
      navigate(path);
    }
  }

  function handleLogout() {
    clearCareteaSession();

    setPerfilAberto(
      false,
    );

    setNotificacoesAbertas(
      false,
    );

    if (onLogout) {
      onLogout();

      return;
    }

    navigate(
      "/login",
    );
  }

  function abrirNotificacoes() {
    setPerfilAberto(
      false,
    );

    setNotificacoesAbertas(
      (aberto) =>
        !aberto,
    );
  }

  function abrirPerfil() {
    setNotificacoesAbertas(
      false,
    );

    setPerfilAberto(
      (aberto) =>
        !aberto,
    );
  }

  return (
    <div className="reports-page">
      <Sidebar />

      <main className="reports-main">
        <header className="reports-topbar">
          <div>
            <h1>
              Relatórios
            </h1>

            <p>
              Acompanhe a evolução dos cuidados
              e gere relatórios para consultas.
            </p>
          </div>

          <div className="profile-area">
            <button
              className="bell"
              type="button"
              aria-label="Notificações"
              aria-expanded={
                notificacoesAbertas
              }
              onClick={
                abrirNotificacoes
              }
            >
              ♢

              {quantidadeNotificacoes >
                0 && (
                <span>
                  {
                    quantidadeNotificacoes
                  }
                </span>
              )}
            </button>

            <button
              className="profile"
              type="button"
              aria-label="Abrir menu do perfil"
              aria-expanded={
                perfilAberto
              }
              onClick={
                abrirPerfil
              }
            >
              <PerfilAvatar />

              <span>
                <strong>
                  {userName}
                </strong>

                {userLevel && (
                  <small>
                    {
                      userLevel
                    }
                  </small>
                )}
              </span>

              <i>
                {perfilAberto
                  ? "⌃"
                  : "⌄"}
              </i>
            </button>
          </div>
        </header>

        <section className="report-filter">
          <div className="filter-intro">
            <span className="filter-icon">
              ▥
            </span>

            <div>
              <strong>
                Relatório de acompanhamento
              </strong>

              <p>
                Selecione o período e o tipo de
                informação que deseja visualizar.
              </p>
            </div>
          </div>

          <div className="filter-controls">
            <label>
              <span>
                Período
              </span>

              <select
                value={
                  periodo
                }
                onChange={(
                  event,
                ) =>
                  alterarPeriodo(
                    event
                      .target
                      .value,
                  )
                }
              >
                <option value="7">
                  Últimos 7 dias
                </option>

                <option value="30">
                  Últimos 30 dias
                </option>

                <option value="90">
                  Últimos 90 dias
                </option>

                <option value="personalizado">
                  Personalizado
                </option>
              </select>
            </label>

            <label>
              <span>
                Tipo de relatório
              </span>

              <select
                value={
                  tipo
                }
                onChange={(
                  event,
                ) =>
                  setTipo(
                    event
                      .target
                      .value,
                  )
                }
              >
                <option value="geral">
                  Relatório geral
                </option>

                <option value="medicamentos">
                  Medicamentos
                </option>

                <option value="consultas">
                  Consultas
                </option>

                <option value="terapias">
                  Terapias
                </option>

                <option value="exames">
                  Exames
                </option>
              </select>
            </label>

            <button
              className="pdf-button"
              type="button"
              onClick={
                gerarPdf
              }
              disabled={
                gerandoPdf
              }
            >
              {gerandoPdf
                ? "Gerando PDF..."
                : "⇩ Gerar PDF"}
            </button>
          </div>
        </section>

        <div className="section-title">
          <div>
            <h2>
              Resumo do período
            </h2>

            <p>
              {periodoTexto}
            </p>
          </div>

          <span>
            Atualizado hoje às 18:30
          </span>
        </div>

        <section className="summary-grid">
          {cardsExibidos.map(
            ([
              icon,
              value,
              title,
              detail,
              tone,
            ]) => (
              <article
                className="summary-card"
                key={title}
              >
                <span
                  className={`summary-icon ${tone}`}
                >
                  {icon}
                </span>

                <div>
                  <strong>
                    {value}
                  </strong>

                  <h3>
                    {title}
                  </h3>

                  <p>
                    {detail}
                  </p>
                </div>

                <button type="button">
                  Ver detalhes →
                </button>
              </article>
            ),
          )}
        </section>

        <section className="reports-grid">
          <div className="left-column">
            <article className="panel medication-panel">
              <div className="panel-header">
                <div>
                  <h2>
                    Adesão aos medicamentos
                  </h2>

                  <p>
                    Resumo das doses previstas e
                    registradas.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navegarPagina(
                      "medicamentos",
                    )
                  }
                >
                  Ver medicamentos
                </button>
              </div>

              <div className="adherence-highlight">
                <div className="progress-ring">
                  <span>
                    —
                  </span>
                </div>

                <div>
                  <strong>
                    Dados ainda não integrados
                  </strong>

                  <p>
                    A adesão será calculada quando o
                    módulo de medicamentos estiver
                    disponível no backend.
                  </p>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>
                        Medicamento
                      </th>

                      <th>
                        Previstas
                      </th>

                      <th>
                        Tomadas
                      </th>

                      <th>
                        Não registradas
                      </th>

                      <th>
                        Adesão
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td colSpan="5">
                        Dados de medicamentos ainda
                        não integrados.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            <article className="panel evolution-panel">
              <div className="panel-header">
                <div>
                  <h2>
                    Evolução dos cuidados
                  </h2>

                  <p>
                    Visão geral da regularidade das
                    rotinas.
                  </p>
                </div>

                <button
                  type="button"
                >
                  Comparar período
                </button>
              </div>

              <div className="chart">
                <div className="y-axis">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>

                <div className="chart-area">
                  <div className="grid-line g1" />
                  <div className="grid-line g2" />
                  <div className="grid-line g3" />
                  <div className="grid-line g4" />

                  <svg
                    viewBox="0 0 600 180"
                    preserveAspectRatio="none"
                  >
                    <text
                      x="300"
                      y="90"
                      textAnchor="middle"
                      fill="#717996"
                      fontSize="15"
                    >
                      Dados de evolução ainda não integrados
                    </text>
                  </svg>

                  <div className="x-axis">
                    <span>Semana 1</span>
                    <span>Semana 2</span>
                    <span>Semana 3</span>
                    <span>Semana 4</span>
                  </div>
                </div>
              </div>

              <div className="legend">
                <span>
                  <b className="purple-line" />
                  Medicamentos
                </span>

                <span>
                  <b className="green-line" />
                  Rotinas e compromissos
                </span>
              </div>
            </article>

            <article className="panel history-panel">
              <div className="panel-header">
                <div>
                  <h2>
                    Histórico recente
                  </h2>

                  <p>
                    Principais registros do período
                    selecionado.
                  </p>
                </div>

                <button
                  type="button"
                >
                  Ver histórico completo
                </button>
              </div>

              <div className="history-list">
                {history.map(
                  ([
                    date,
                    icon,
                    title,
                    detail,
                    tag,
                    tone,
                  ]) => (
                    <article
                      key={`${date}-${title}`}
                    >
                      <time>
                        {date}
                      </time>

                      <span
                        className={`history-icon ${tone}`}
                      >
                        {icon}
                      </span>

                      <div>
                        <strong>
                          {title}
                        </strong>

                        <small>
                          {detail}
                        </small>
                      </div>

                      <span
                        className={`history-tag ${tone}`}
                      >
                        {tag}
                      </span>
                    </article>
                  ),
                )}
              </div>
            </article>
          </div>

          <aside className="right-column">
            <article className="panel wellbeing-panel">
              <div className="panel-header">
                <div>
                  <h2>
                    Bem-estar registrado
                  </h2>

                  <p>
                    Como os registros de humor
                    ficaram no período.
                  </p>
                </div>
              </div>

              <div className="mood-main">
                <span>
                  ♡
                </span>

                <div>
                  <strong>
                    {humorMaisRegistrado}
                  </strong>

                  <p>
                    Estado mais registrado
                  </p>
                </div>
              </div>

              <div className="mood-bars">
                {barrasBemEstar.map(
                  ([
                    label,
                    width,
                    tone,
                  ]) => (
                    <div
                      className="mood-row"
                      key={label}
                    >
                      <span>
                        {label}
                      </span>

                      <div>
                        <b
                          className={
                            tone
                          }
                          style={{
                            width: `${Math.min(
                              Math.max(
                                width,
                                0,
                              ),
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </article>

            <article className="panel care-summary">
              <div className="panel-header">
                <div>
                  <h2>
                    Consultas e terapias
                  </h2>

                  <p>
                    Resumo das atividades
                    realizadas.
                  </p>
                </div>
              </div>

              <div className="care-stat">
                <span className="purple">
                  ▣
                </span>

                <div>
                  <strong>
                    Consultas ainda não integradas
                  </strong>

                  <small>
                    Os dados aparecerão após a integração
                    do módulo de agenda.
                  </small>
                </div>
              </div>

              <div className="care-stat">
                <span className="pink">
                  ♡
                </span>

                <div>
                  <strong>
                    Terapias ainda não integradas
                  </strong>

                  <small>
                    Os dados aparecerão após a integração
                    do módulo de agenda.
                  </small>
                </div>
              </div>

              <div className="care-stat">
                <span className="green">
                  △
                </span>

                <div>
                  <strong>
                    {relatorio?.documentos?.exames ?? 0} exames registrados
                  </strong>

                  <small>
                    Contagem baseada nos documentos
                    cadastrados no período.
                  </small>
                </div>
              </div>
            </article>

            <article className="panel report-note">
              <span>
                💡
              </span>

              <div>
                <h2>
                  Relatório de acompanhamento
                </h2>

                <p>
                  Este relatório resume os registros
                  do CareTEA e não substitui
                  avaliação médica, laudo ou
                  prontuário profissional.
                </p>
              </div>
            </article>
          </aside>
        </section>

        <div className="reports-strip">
          <PuzzleStrip />
        </div>

        <ModalNotificacoes
          aberto={
            notificacoesAbertas
          }
          onClose={() =>
            setNotificacoesAbertas(
              false,
            )
          }
          onQuantidadeAlterada={
            setQuantidadeNotificacoes
          }
          onVerTodas={() =>
            navegarPagina(
              "notificacoes",
            )
          }
        />

        <ModalPerfil
          aberto={
            perfilAberto
          }
          onClose={() =>
            setPerfilAberto(
              false,
            )
          }
          onNavigate={
            navegarPagina
          }
          onLogout={
            handleLogout
          }
        />
      </main>
    </div>
  );
}

export default Relatorios;