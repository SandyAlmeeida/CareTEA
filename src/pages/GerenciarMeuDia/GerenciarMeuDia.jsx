import { useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Topbar from "../../components/Topbar/Topbar.jsx";
import Footer from "../../components/Footer/Footer";
import "./GerenciarMeuDia.css";

function GerenciarMeuDia({
  userName = "Adriana",
  profileName = "Evellyn",
  autismLevel = 2,
  onLogout,
}) {
  const [access, setAccess] = useState(null);
  const [feedback, setFeedback] = useState("");

  function generateAccess() {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const code = Array.from({ length: 6 }, () => {
      const index = Math.floor(Math.random() * characters.length);
      return characters[index];
    }).join("");

    const link = `${window.location.origin}/acesso-meu-dia?codigo=${code}`;

    setAccess({ code, link });
    setFeedback("");
  }

  async function copyValue(value, label) {
    try {
      await navigator.clipboard.writeText(value);
      setFeedback(`${label} copiado!`);
    } catch {
      setFeedback(`Copie o ${label.toLowerCase()} manualmente.`);
    }
  }

  const qrCells = useMemo(() => {
    if (!access) return [];

    const seed = access.code
      .split("")
      .reduce((sum, character) => sum + character.charCodeAt(0), 0);

    return Array.from({ length: 169 }, (_, index) => {
      const row = Math.floor(index / 13);
      const column = index % 13;

      const finder =
        (row < 4 && column < 4) ||
        (row < 4 && column > 8) ||
        (row > 8 && column < 4);

      if (finder) return true;

      return (seed + index * 7 + row * 5 + column * 3) % 4 !== 0;
    });
  }, [access]);

  return (
    <div className="caretea-dashboard gerenciar-meu-dia-page">
      <Sidebar
        hideExames
        accountType="responsavel"
        autismLevel={2}
    />

      <div className="gerenciar-meu-dia-content">
      <main className="gerenciar-meu-dia-main">
        <Topbar
          title="Acesso Da Pessoa Autista"
          subtitle={`Gerencie o acesso simplificado de ${profileName}.`}
          userName={userName}
          userLevel={`Responsável · Nível ${autismLevel}`}
          notifications={3}
          onLogout={onLogout}
        />

        <section className="gerenciar-intro">
          <div className="gerenciar-intro-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
              <path d="M10 18.5h4" />
              <path d="M9.5 7.5h5M9.5 11h5M9.5 14.5h3" />
            </svg>
          </div>

          <div>
            <span>Acesso assistido · Nível 2</span>
            <h1>Minha Rotina no celular de {profileName}</h1>
            <p>
              Você organiza medicamentos, consultas e rotina pelo painel completo.
              {profileName} acessa apenas uma versão simples e direta pelo próprio celular.
            </p>
          </div>
        </section>

        <section className="gerenciar-flow">
          <article>
            <b>1</b>
            <div>
              <strong>Você organiza</strong>
              <p>Cadastre os cuidados normalmente no seu painel.</p>
            </div>
          </article>

          <span>→</span>

          <article>
            <b>2</b>
            <div>
              <strong>CareTEA gera o acesso</strong>
              <p>Um código, um link e um QR Code.</p>
            </div>
          </article>

          <span>→</span>

          <article>
            <b>3</b>
            <div>
              <strong>{profileName} abre a Minha Rotina</strong>
              <p>Sem precisar criar outra conta completa.</p>
            </div>
          </article>
        </section>

        {!access ? (
          <section className="gerenciar-generate-card">
            <div>
              <span className="gerenciar-status-dot" />
              <div>
                <strong>Nenhum acesso gerado ainda</strong>
                <p>
                  Gere o primeiro acesso quando o celular de {profileName} estiver disponível.
                </p>
              </div>
            </div>

            <button type="button" onClick={generateAccess}>
              Gerar acesso
            </button>
          </section>
        ) : (
          <section className="gerenciar-access-card">
            <header>
              <div>
                <span className="gerenciar-success">✓</span>
                <div>
                  <h2>Acesso criado</h2>
                  <p>Escolha a forma mais fácil de compartilhar com {profileName}.</p>
                </div>
              </div>

              <button type="button" onClick={generateAccess}>
                Gerar novo
              </button>
            </header>

            <div className="gerenciar-access-grid">
              <div className="gerenciar-access-data">
                <article>
                  <span>Código de acesso</span>
                  <div className="gerenciar-code-row">
                    <strong>{access.code}</strong>
                    <button
                      type="button"
                      onClick={() => copyValue(access.code, "Código")}
                    >
                      Copiar
                    </button>
                  </div>
                </article>

                <article>
                  <span>Link de acesso</span>
                  <div className="gerenciar-link-row">
                    <strong>{access.link}</strong>
                    <button
                      type="button"
                      onClick={() => copyValue(access.link, "Link")}
                    >
                      Copiar
                    </button>
                  </div>
                </article>

                <div className="gerenciar-note">
                  <strong>O que acontece quando abrir?</strong>
                  <p>
                    O link leva para a tela de acesso e depois para o painel simplificado
                    <b> Minha Rotina</b>.
                  </p>
                </div>

                {feedback && (
                  <p className="gerenciar-feedback" aria-live="polite">
                    {feedback}
                  </p>
                )}
              </div>

              <aside className="gerenciar-qr-card">
                <span>QR Code</span>

                <div className="gerenciar-fake-qr" aria-hidden="true">
                  {qrCells.map((filled, index) => (
                    <i key={index} className={filled ? "filled" : ""} />
                  ))}
                </div>

                <strong>Escaneie no celular de {profileName}</strong>
                <small>
                  QR ilustrativo no protótipo. O QR real será gerado pelo backend.
                </small>
              </aside>
            </div>
          </section>
        )}
      </main>
      <Footer />
      </div>
    </div>
  );
}

export default GerenciarMeuDia;
