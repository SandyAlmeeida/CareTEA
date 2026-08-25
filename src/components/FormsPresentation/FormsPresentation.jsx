import logoCaretea from "../../assets/logo-caretea.png";
import familiaCaretea from "../../assets/familia-caretea.png";
import "./FormsPresentation.css";

function FormsPresentation({ descricao }) {
    return (
        <section className="presentation" aria-labelledby="caretea-title">
            <img className="brand-logo" src={logoCaretea} alt="CareTEA" />

            <div className="presentation-text">
                <h1 id="caretea-title">Organizando cuidados, promovendo <span>autonomia.</span></h1>

                <p className="description">{descricao}</p>
            </div>

            <div className="features" aria-label="Benefícios da plataforma">
                <article className="feature">
                    <span className="feature-icon feature-blue">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                        </svg>
                    </span>
                    <p>Cuidado com empatia</p>
                </article>

                <article className="feature">
                    <span className="feature-icon feature-green">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
                        </svg>
                    </span>
                    <p>Rotinas e organização</p>
                </article>

                <article className="feature">
                    <span className="feature-icon feature-yellow">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
                        </svg>
                    </span>
                    <p>Lembretes inteligentes</p>
                </article>

                <article className="feature">
                    <span className="feature-icon feature-red">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <circle cx="9" cy="7" r="4" />
                            <path d="M3 21v-2a6 6 0 0 1 6-6h1" />
                            <circle cx="17" cy="8" r="3" />
                            <path d="M14 14h3a5 5 0 0 1 5 5v2H12v-2a5 5 0 0 1 5-5" />
                        </svg>
                    </span>
                    <p>Autonomia e inclusão</p>
                </article>
            </div>

            <div className="illustration-wrap">
                <img src={familiaCaretea} alt="Responsável ajudando uma criança a utilizar um tablet" />
            </div>
        </section>
    )
}

export default FormsPresentation