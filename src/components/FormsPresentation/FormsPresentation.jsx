import logoCaretea from "../../assets/imagens/logo_careTEA.svg?react";
import familiaCaretea from "../../assets/imagens/familia_careTEA.svg?react";
import Heart from "../../assets/icons/heart.svg?react";
import Calendar from "../../assets/icons/calendar-dots.svg?react";
import Bell from "../../assets/icons/bell-simple.svg?react";
import People from "../../assets/icons/users.svg?react";
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
                        <img src={Heart} />
                    </span>
                    <p>Cuidado com empatia</p>
                </article>

                <article className="feature">
                    <span className="feature-icon feature-green">
                        <img src={Calendar} />
                    </span>
                    <p>Rotinas e organização</p>
                </article>

                <article className="feature">
                    <span className="feature-icon feature-yellow">
                        <img src={Bell} />
                    </span>
                    <p>Lembretes inteligentes</p>
                </article>

                <article className="feature">
                    <span className="feature-icon feature-red">
                        <img src={People} />
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