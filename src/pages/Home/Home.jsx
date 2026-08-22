import { Link } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./Home.css";

const audience = [
  {
    number: "01",
    letter: "A",
    title: "Pessoa autista",
    text: "Mais autonomia para acompanhar a própria rotina com clareza, previsibilidade e tranquilidade.",
    className: "ct-audience-purple",
  },
  {
    number: "02",
    letter: "R",
    title: "Responsável",
    text: "Mais segurança para organizar compromissos, medicamentos e informações importantes do dia a dia.",
    className: "ct-audience-cyan",
  },
  {
    number: "03",
    letter: "+",
    title: "Rede de apoio",
    text: "Tudo mais organizado para quem também participa do cuidado e quer acompanhar melhor a rotina.",
    className: "ct-audience-lime",
  },
];

const levels = [
  {
    number: "01",
    label: "MAIS AUTONOMIA",
    title: "Mais independência na rotina.",
    text: "Para quem consegue acompanhar boa parte do próprio dia e quer uma ferramenta visual para se organizar melhor.",
    className: "ct-level-lime",
  },
  {
    number: "02",
    label: "AUTONOMIA ASSISTIDA",
    title: "Apoio quando for preciso.",
    text: "A pessoa mantém sua autonomia, mas com o suporte do responsável nos momentos mais importantes da rotina.",
    className: "ct-level-violet",
  },
  {
    number: "03",
    label: "MAIOR SUPORTE",
    title: "Cuidado mais acompanhado.",
    text: "Para situações em que o responsável participa mais de perto da organização e do acompanhamento do dia a dia.",
    className: "ct-level-cyan",
  },
];

function Home() {
  return (
    <div className="caretea-home">
      <Header />

      <main>
        <section className="ct-hero" id="inicio">
          <div className="ct-hero-aurora ct-hero-aurora-one" />
          <div className="ct-hero-aurora ct-hero-aurora-two" />
          <div className="ct-hero-aurora ct-hero-aurora-three" />
          <div className="ct-hero-grid-lines" />

          <div className="ct-hero-star ct-star-one">✦</div>
          <div className="ct-hero-star ct-star-two">✦</div>
          <div className="ct-hero-star ct-star-three">✦</div>

          <div className="ct-container ct-hero-grid">
            <div className="ct-hero-copy">
              <div className="ct-kicker">
                <span />
                CUIDADO • ACOLHIMENTO • AUTONOMIA
              </div>

              <h1>
                Cuidar da rotina
                <br />
                pode ser
                <strong> mais leve.</strong>
              </h1>

              <p>
                O CareTEA foi pensado para acolher pessoas autistas e
                seus responsáveis, ajudando a organizar compromissos,
                medicamentos, documentos e informações importantes com
                mais calma, clareza e segurança.
              </p>

              <div className="ct-hero-actions">
                <Link to="/cadastro" className="ct-primary-button">
                  Começar agora
                  <span>↗</span>
                </Link>

                <a href="#funcionalidades" className="ct-ghost-button">
                  Conhecer a plataforma
                </a>
              </div>

              <div className="ct-hero-points">
                <div>
                  <i className="ct-point-violet" />
                  Mais organização
                </div>

                <div>
                  <i className="ct-point-cyan" />
                  Mais previsibilidade
                </div>

                <div>
                  <i className="ct-point-lime" />
                  Mais autonomia
                </div>

                <div>
                  <i className="ct-point-coral" />
                  Mais tranquilidade
                </div>
              </div>
            </div>

            <div className="ct-hero-visual">
              <div className="ct-orbit ct-orbit-one" />
              <div className="ct-orbit ct-orbit-two" />
              <div className="ct-orbit ct-orbit-three" />

              <div className="ct-floating-chip ct-chip-consult">
                <span className="ct-chip-icon ct-chip-cyan">+</span>

                <div>
                  <small>PRÓXIMO COMPROMISSO</small>
                  <strong>Neurologista • 14:00</strong>
                </div>
              </div>

              <div className="ct-floating-chip ct-chip-med">
                <span className="ct-chip-icon ct-chip-lime">✓</span>

                <div>
                  <small>MEDICAMENTO</small>
                  <strong>Dose registrada</strong>
                </div>
              </div>

              <div className="ct-floating-chip ct-chip-doc">
                <span className="ct-chip-icon ct-chip-coral">≡</span>

                <div>
                  <small>DOCUMENTOS</small>
                  <strong>Receita adicionada</strong>
                </div>
              </div>

              <div className="ct-floating-chip ct-chip-ai">
                <span className="ct-chip-icon ct-chip-pink">✦</span>

                <div>
                  <small>ASSISTENTE CARETEA</small>
                  <strong>Posso ajudar?</strong>
                </div>
              </div>

              <div className="ct-app-window">
                <div className="ct-window-top">
                  <div>
                    <i />
                    <i />
                    <i />
                  </div>

                  <span>caretea.app</span>
                </div>

                <div className="ct-window-welcome">
                  <div>
                    <span>Olá, Sandy 👋</span>
                    <h3>Seu dia, com mais leveza.</h3>
                  </div>

                  <div className="ct-avatar">SA</div>
                </div>

                <div className="ct-window-cards">
                  <article>
                    <span>03</span>
                    <small>Medicamentos</small>
                  </article>

                  <article>
                    <span>01</span>
                    <small>Consulta</small>
                  </article>

                  <article>
                    <span>01</span>
                    <small>Exame</small>
                  </article>
                </div>

                <div className="ct-today">
                  <div className="ct-today-header">
                    <strong>Hoje</strong>
                    <span>18 Agosto</span>
                  </div>

                  <div className="ct-today-row">
                    <time>08:00</time>

                    <i className="ct-line-lime" />

                    <div>
                      <strong>Risperidona 1mg</strong>
                      <small>1 comprimido</small>
                    </div>

                    <b>✓</b>
                  </div>

                  <div className="ct-today-row">
                    <time>14:00</time>

                    <i className="ct-line-violet" />

                    <div>
                      <strong>Consulta com neurologista</strong>
                      <small>Compromisso confirmado</small>
                    </div>

                    <b>→</b>
                  </div>
                </div>

                <div className="ct-window-ai">
                  <span>✦</span>

                  <div>
                    <strong>Assistente CareTEA</strong>
                    <small>Como posso te ajudar hoje?</small>
                  </div>

                  <button type="button">→</button>
                </div>
              </div>
            </div>
          </div>

          <div className="ct-hero-cut" />
        </section>

        <section className="ct-ribbon">
          <div className="ct-ribbon-track">
            <span>ACOLHIMENTO</span>
            <b>✦</b>
            <span>AUTONOMIA</span>
            <b>●</b>
            <span>ORGANIZAÇÃO</span>
            <b>✦</b>
            <span>CUIDADO</span>
            <b>●</b>
            <span>ROTINA</span>
            <b>✦</b>
            <span>TRANQUILIDADE</span>
            <b>●</b>
            <span>APOIO</span>
            <b>✦</b>
            <span>PREVISIBILIDADE</span>
          </div>
        </section>

        <section className="ct-intro">
          <div className="ct-intro-shape ct-intro-shape-one" />
          <div className="ct-intro-shape ct-intro-shape-two" />
          <div className="ct-intro-shape ct-intro-shape-three" />

          <div className="ct-container ct-intro-layout">
            <div className="ct-intro-number">
              <span>01</span>
              <div />
            </div>

            <div className="ct-intro-copy">
              <span className="ct-section-tag">POR QUE O CARETEA?</span>

              <h2>
                Quando a rotina fica
                <br />
                mais clara,
                <strong> o cuidado também fica mais leve.</strong>
              </h2>

              <p>
                Nem todo dia é simples. Nem toda rotina é igual. Por
                isso o CareTEA reúne o que realmente importa em um só
                lugar, para ajudar pessoas autistas e responsáveis a se
                sentirem mais amparados no dia a dia.
              </p>
            </div>

            <div className="ct-intro-words">
              <span>consulta</span>
              <span>medicamento</span>
              <span>laudo</span>
              <span>exame</span>
              <span>terapia</span>
              <span>lembrete</span>
            </div>
          </div>
        </section>

        <section className="ct-features" id="funcionalidades">
          <div className="ct-feature-glow ct-feature-glow-one" />
          <div className="ct-feature-glow ct-feature-glow-two" />

          <div className="ct-container">
            <div className="ct-features-heading">
              <div>
                <span className="ct-section-tag ct-tag-light">
                  FUNCIONALIDADES
                </span>

                <h2>
                  Tudo o que ajuda
                  <br />
                  a rotina a ficar
                  <strong> mais tranquila.</strong>
                </h2>
              </div>

              <p>
                O CareTEA foi pensado para reduzir a sobrecarga e deixar
                a rotina mais visual, mais organizada e mais fácil de
                acompanhar.
              </p>
            </div>

            <div className="ct-feature-grid">
              <article className="ct-feature-main">
                <div className="ct-feature-main-head">
                  <span>AGENDA VISUAL</span>
                  <b>01</b>
                </div>

                <h3>Compromissos organizados, com menos correria.</h3>

                <p>
                  Consultas, terapias, exames e atividades do dia a dia
                  em uma agenda mais simples de entender e acompanhar.
                </p>

                <div className="ct-calendar">
                  <div className="ct-calendar-title">
                    <strong>Agosto</strong>
                    <span>2026</span>
                  </div>

                  <div className="ct-calendar-days">
                    <small>S</small>
                    <small>T</small>
                    <small>Q</small>
                    <small>Q</small>
                    <small>S</small>
                    <small>S</small>
                    <small>D</small>

                    <span>16</span>
                    <span>17</span>
                    <b>18</b>
                    <span>19</span>
                    <span>20</span>
                    <span>21</span>
                    <span>22</span>
                  </div>
                </div>

                <div className="ct-calendar-event">
                  <span>14:00</span>
                  <strong>Consulta com neurologista</strong>
                  <small>Compromisso presencial</small>
                </div>
              </article>

              <article className="ct-feature-side">
                <div className="ct-mini-top">
                  <span>02</span>
                  <b>MEDICAMENTOS</b>
                </div>

                <h3>Mais segurança na hora dos medicamentos.</h3>

                <p>
                  Horários, doses e registros em um espaço visual para
                  ajudar a lembrar e acompanhar com mais tranquilidade.
                </p>

                <div className="ct-med-list">
                  <div>
                    <i />
                    <p>
                      <strong>08:00</strong>
                      <small>Tomado com sucesso</small>
                    </p>
                    <b>✓</b>
                  </div>

                  <div>
                    <i />
                    <p>
                      <strong>20:00</strong>
                      <small>Próxima dose do dia</small>
                    </p>
                    <b>○</b>
                  </div>
                </div>
              </article>

              <article className="ct-feature-ai">
                <div className="ct-ai-glow" />

                <div className="ct-mini-top">
                  <span>03</span>
                  <b>ASSISTENTE IA</b>
                </div>

                <h3>Um apoio a mais quando bater a dúvida.</h3>

                <p>
                  Um espaço para perguntar, organizar ideias e encontrar
                  respostas de uma forma mais simples e acessível.
                </p>

                <div className="ct-chat">
                  <div>O que tenho amanhã?</div>

                  <div>
                    Amanhã você tem consulta às 14h e exame às 17h.
                  </div>
                </div>
              </article>

              <article className="ct-feature-docs">
                <div className="ct-mini-top">
                  <span>04</span>
                  <b>DOCUMENTOS</b>
                </div>

                <h3>Laudos, receitas e exames sempre à mão.</h3>

                <div className="ct-doc-items">
                  <div>
                    <span>PDF</span>

                    <p>
                      <strong>Laudo médico</strong>
                      <small>18 ago 2026</small>
                    </p>
                  </div>

                  <div>
                    <span>PDF</span>

                    <p>
                      <strong>Receita</strong>
                      <small>10 ago 2026</small>
                    </p>
                  </div>
                </div>
              </article>

              <article className="ct-feature-alert">
                <div className="ct-alert-symbol">!</div>

                <div>
                  <span>05 • LEMBRETES</span>

                  <h3>Lembretes gentis, na hora certa.</h3>

                  <p>
                    Consulta em 30 minutos
                    <strong>Neurologista • 14:00</strong>
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="ct-spectrum">
          <div className="ct-spectrum-noise" />

          <div className="ct-container ct-spectrum-layout">
            <div className="ct-spectrum-copy">
              <span className="ct-section-tag">UM ESPECTRO DE ROTINAS</span>

              <h2>
                Cada pessoa vive
                <br />
                a rotina de um jeito.
                <br />
                <strong>O cuidado também pode ser assim.</strong>
              </h2>

              <p>
                O CareTEA respeita diferenças, ritmos e necessidades de
                apoio. Em vez de tentar encaixar todo mundo em uma única
                forma de organização, ele busca acompanhar cada realidade
                com mais acolhimento.
              </p>
            </div>

            <div className="ct-spectrum-art">
              <div className="ct-spectrum-loop ct-loop-one" />
              <div className="ct-spectrum-loop ct-loop-two" />
              <div className="ct-spectrum-loop ct-loop-three" />

              <div className="ct-spectrum-core">
                <span>Care</span>
                <strong>TEA</strong>
              </div>

              <span className="ct-spectrum-pill ct-pill-one">
                autonomia
              </span>

              <span className="ct-spectrum-pill ct-pill-two">
                comunicação
              </span>

              <span className="ct-spectrum-pill ct-pill-three">
                apoio
              </span>

              <span className="ct-spectrum-pill ct-pill-four">
                rotina
              </span>

              <span className="ct-spectrum-pill ct-pill-five">
                cuidado
              </span>

              <span className="ct-spectrum-pill ct-pill-six">
                previsibilidade
              </span>
            </div>
          </div>
        </section>

        <section className="ct-audience" id="para-quem">
          <div className="ct-container">
            <div className="ct-audience-heading">
              <span className="ct-section-tag">PARA QUEM É</span>

              <h2>
                Para quem vive a rotina
                <br />
                e para quem
                <strong> cuida com amor.</strong>
              </h2>

              <p>
                O sistema se adapta ao papel de cada pessoa no cuidado.
              </p>
            </div>

            <div className="ct-audience-grid">
              {audience.map((item) => (
                <article
                  className={`ct-audience-card ${item.className}`}
                  key={item.number}
                >
                  <div className="ct-audience-top">
                    <span>{item.number}</span>
                    <i />
                  </div>

                  <div className="ct-audience-letter">
                    {item.letter}
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.text}</p>

                  <span className="ct-audience-arrow">↗</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ct-autonomy" id="autonomia">
          <div className="ct-autonomy-orb ct-auto-orb-one" />
          <div className="ct-autonomy-orb ct-auto-orb-two" />

          <div className="ct-container">
            <div className="ct-autonomy-heading">
              <span className="ct-section-tag ct-tag-light">
                NÍVEIS DE AUTONOMIA
              </span>

              <h2>
                O apoio pode mudar.
                <br />
                <strong>A pessoa continua no centro.</strong>
              </h2>
            </div>

            <div className="ct-levels">
              {levels.map((level) => (
                <article
                  className={`ct-level ${level.className}`}
                  key={level.number}
                >
                  <span className="ct-level-number">{level.number}</span>

                  <div>
                    <small>{level.label}</small>
                    <h3>{level.title}</h3>
                    <p>{level.text}</p>
                  </div>

                  <span className="ct-level-mark">✦</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ct-story" id="sobre">
          <div className="ct-story-bg ct-story-bg-one" />
          <div className="ct-story-bg ct-story-bg-two" />
          <div className="ct-story-bg ct-story-bg-three" />

          <div className="ct-container ct-story-layout">
            <div className="ct-story-visual">
              <div className="ct-story-poster">
                <div className="ct-poster-word">CARE</div>

                <div className="ct-poster-word ct-poster-tea">TEA</div>

                <span className="ct-poster-small ct-poster-small-one">
                  acolhimento
                </span>

                <span className="ct-poster-small ct-poster-small-two">
                  cuidado
                </span>

                <span className="ct-poster-small ct-poster-small-three">
                  rotina
                </span>

                <div className="ct-poster-circle" />
              </div>
            </div>

            <div className="ct-story-copy">
              <span className="ct-section-tag">NOSSA IDEIA</span>

              <h2>
                Organizar também
                <br />
                <strong>é uma forma de cuidar.</strong>
              </h2>

              <p>
                O CareTEA nasceu para tornar a rotina menos cansativa e
                mais acolhedora, reunindo informações importantes em um
                lugar só.
              </p>

              <p>
                Porque tecnologia também pode significar apoio,
                segurança, previsibilidade e tranquilidade para quem
                vive essa rotina todos os dias.
              </p>
            </div>
          </div>
        </section>

        <section className="ct-final">
          <div className="ct-final-mesh" />
          <div className="ct-final-orb ct-final-orb-one" />
          <div className="ct-final-orb ct-final-orb-two" />
          <div className="ct-final-orb ct-final-orb-three" />

          <div className="ct-container ct-final-inner">
            <span>CARETEA</span>

            <h2>
              Mais clareza.
              <br />
              Mais apoio.
              <br />
              <strong>Mais leveza.</strong>
            </h2>

            <p>
              Comece hoje a construir uma rotina mais organizada,
              previsível e acolhedora.
            </p>

            <Link to="/cadastro">
              Criar minha conta
              <span>↗</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;