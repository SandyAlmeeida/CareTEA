import { useState } from "react";
import logoCaretea from "../../../assets/logo-caretea.png";
import "./Relatorios.css";

const menu = [
  ["dashboard", "⌂", "Dashboard"],
  ["agenda", "▣", "Agenda"],
  ["medicamentos", "◊", "Medicamentos"],
  ["consultas", "♧", "Consultas"],
  ["exames", "△", "Exames"],
  ["terapias", "♡", "Terapias"],
  ["assistente", "◉", "IA Assistente"],
  ["notificacoes", "♢", "Notificações"],
  ["documentos", "▤", "Documentos"],
  ["relatorios", "▥", "Relatórios"],
  ["perfil", "♙", "Perfil"],
  ["responsaveis", "♧", "Responsáveis"],
  ["configuracoes", "⚙", "Configurações"],
];

const cards = [
  ["◊", "92%", "Adesão aos medicamentos", "23 de 25 doses registradas", "purple"],
  ["▣", "2", "Consultas realizadas", "1 próxima consulta agendada", "blue"],
  ["♡", "6", "Terapias realizadas", "1 falta registrada", "pink"],
  ["△", "3", "Exames", "2 realizados e 1 pendente", "green"],
];

const history = [
  ["12/05/2025", "▣", "Consulta - Neurologista", "Clínica Neuro • Realizada", "Consulta", "blue"],
  ["13/05/2025", "♡", "Fonoaudiologia", "Sessão online • Realizada", "Terapia", "pink"],
  ["15/05/2025", "△", "Exame de sangue", "Laboratório Vida • Realizado", "Exame", "green"],
  ["18/05/2025", "◊", "Metilfenidato 10mg", "Dose das 12:00 • Não registrada", "Medicamento", "orange"],
];

function Relatorios({ userName = "Sandy", onNavigate, onLogout }) {
  const [periodo, setPeriodo] = useState("30");
  const [tipo, setTipo] = useState("geral");

  const periodoTexto =
    periodo === "7"
      ? "Últimos 7 dias"
      : periodo === "90"
        ? "Últimos 90 dias"
        : periodo === "personalizado"
          ? "Período personalizado"
          : "Últimos 30 dias";

  return (
    <div className="reports-page">

      <main className="reports-main">
        <header className="reports-topbar">
          <div>
            <h1>Relatórios</h1>
            <p>Acompanhe a evolução dos cuidados e gere relatórios para consultas.</p>
          </div>

          <div className="profile-area">
            <button className="bell" type="button">
              ♢ <span>3</span>
            </button>

            <button className="profile" type="button">
              <span className="avatar">👩🏻</span>
              <span>
                <strong>{userName}</strong>
                <small>Nível 2 - Assistida</small>
              </span>
              <i>⌄</i>
            </button>

            {onLogout && (
              <button className="logout" type="button" onClick={onLogout}>
                Sair
              </button>
            )}
          </div>
        </header>

        <section className="report-filter">
          <div className="filter-intro">
            <span className="filter-icon">▥</span>
            <div>
              <strong>Relatório de acompanhamento</strong>
              <p>Selecione o período e o tipo de informação que deseja visualizar.</p>
            </div>
          </div>

          <div className="filter-controls">
            <label>
              <span>Período</span>
              <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                <option value="7">Últimos 7 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
                <option value="personalizado">Personalizado</option>
              </select>
            </label>

            <label>
              <span>Tipo de relatório</span>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="geral">Relatório geral</option>
                <option value="medicamentos">Medicamentos</option>
                <option value="consultas">Consultas</option>
                <option value="terapias">Terapias</option>
                <option value="exames">Exames</option>
              </select>
            </label>

            <button className="pdf-button" type="button" onClick={() => window.print()}>
              ⇩ Gerar PDF
            </button>
          </div>
        </section>

        <div className="section-title">
          <div>
            <h2>Resumo do período</h2>
            <p>{periodoTexto}</p>
          </div>
          <span>Atualizado hoje às 18:30</span>
        </div>

        <section className="summary-grid">
          {cards.map(([icon, value, title, detail, tone]) => (
            <article className="summary-card" key={title}>
              <span className={`summary-icon ${tone}`}>{icon}</span>
              <div>
                <strong>{value}</strong>
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
              <button type="button">Ver detalhes →</button>
            </article>
          ))}
        </section>

        <section className="reports-grid">
          <div className="left-column">
            <article className="panel medication-panel">
              <div className="panel-header">
                <div>
                  <h2>Adesão aos medicamentos</h2>
                  <p>Resumo das doses previstas e registradas.</p>
                </div>
                <button type="button">Ver medicamentos</button>
              </div>

              <div className="adherence-highlight">
                <div className="progress-ring">
                  <span>92%</span>
                </div>
                <div>
                  <strong>Excelente adesão</strong>
                  <p>23 de 25 doses previstas foram registradas no período.</p>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Medicamento</th>
                      <th>Previstas</th>
                      <th>Tomadas</th>
                      <th>Não registradas</th>
                      <th>Adesão</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Risperidona 1mg</td>
                      <td>14</td>
                      <td>14</td>
                      <td>0</td>
                      <td><span className="pill green">100%</span></td>
                    </tr>
                    <tr>
                      <td>Metilfenidato 10mg</td>
                      <td>7</td>
                      <td>6</td>
                      <td>1</td>
                      <td><span className="pill yellow">86%</span></td>
                    </tr>
                    <tr>
                      <td>Melatonina 3mg</td>
                      <td>4</td>
                      <td>3</td>
                      <td>1</td>
                      <td><span className="pill orange">75%</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            <article className="panel evolution-panel">
              <div className="panel-header">
                <div>
                  <h2>Evolução dos cuidados</h2>
                  <p>Visão geral da regularidade das rotinas.</p>
                </div>
                <button type="button">Comparar período</button>
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
                  <svg viewBox="0 0 600 180" preserveAspectRatio="none">
                    <polyline
                      points="0,120 90,90 180,98 270,55 360,68 450,35 540,42 600,22"
                      fill="none"
                      stroke="#6a46e8"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="0,142 90,128 180,112 270,98 360,82 450,80 540,63 600,58"
                      fill="none"
                      stroke="#35b675"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
                <span><b className="purple-line" /> Medicamentos</span>
                <span><b className="green-line" /> Rotinas e compromissos</span>
              </div>
            </article>

            <article className="panel history-panel">
              <div className="panel-header">
                <div>
                  <h2>Histórico recente</h2>
                  <p>Principais registros do período selecionado.</p>
                </div>
                <button type="button">Ver histórico completo</button>
              </div>

              <div className="history-list">
                {history.map(([date, icon, title, detail, tag, tone]) => (
                  <article key={`${date}-${title}`}>
                    <time>{date}</time>
                    <span className={`history-icon ${tone}`}>{icon}</span>
                    <div>
                      <strong>{title}</strong>
                      <small>{detail}</small>
                    </div>
                    <span className={`history-tag ${tone}`}>{tag}</span>
                  </article>
                ))}
              </div>
            </article>
          </div>

          <aside className="right-column">
            <article className="panel wellbeing-panel">
              <div className="panel-header">
                <div>
                  <h2>Bem-estar registrado</h2>
                  <p>Como os registros de humor ficaram no período.</p>
                </div>
              </div>

              <div className="mood-main">
                <span>🙂</span>
                <div>
                  <strong>Bem</strong>
                  <p>Estado mais registrado</p>
                </div>
              </div>

              <div className="mood-bars">
                {[
                  ["Ótimo", 48, "green"],
                  ["Bem", 78, "yellow"],
                  ["Mais ou menos", 43, "orange"],
                  ["Mal", 28, "red"],
                  ["Muito mal", 15, "purple"],
                ].map(([label, width, tone]) => (
                  <div className="mood-row" key={label}>
                    <span>{label}</span>
                    <div>
                      <b className={tone} style={{ width: `${width}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel care-summary">
              <div className="panel-header">
                <div>
                  <h2>Consultas e terapias</h2>
                  <p>Resumo das atividades realizadas.</p>
                </div>
              </div>

              <div className="care-stat">
                <span className="purple">▣</span>
                <div>
                  <strong>2 consultas realizadas</strong>
                  <small>100% das consultas agendadas</small>
                </div>
              </div>

              <div className="care-stat">
                <span className="pink">♡</span>
                <div>
                  <strong>6 terapias realizadas</strong>
                  <small>1 falta registrada</small>
                </div>
              </div>

              <div className="care-stat">
                <span className="green">△</span>
                <div>
                  <strong>2 exames realizados</strong>
                  <small>1 exame ainda está pendente</small>
                </div>
              </div>
            </article>

            <article className="panel report-note">
              <span>💡</span>
              <div>
                <h2>Relatório de acompanhamento</h2>
                <p>
                  Este relatório resume os registros do CareTEA e não substitui
                  avaliação médica, laudo ou prontuário profissional.
                </p>
              </div>
            </article>
          </aside>
        </section>

        <div className="reports-strip" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <span key={index} className={`strip-${index % 6}`} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Relatorios;