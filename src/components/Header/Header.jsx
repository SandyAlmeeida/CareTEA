import { Link } from "react-router-dom";
import logoCaretea from "../../assets/logo-caretea.png";
import PuzzleStrip from "../PuzzleStrip/PuzzleStrip.jsx";
import "./Header.css";

function Header() {
  return (
    <div className="landing-header-shell">
      <header className="landing-header">
        <div className="landing-header-container">
          <a href="#inicio" className="landing-header-logo">
            <img src={logoCaretea} alt="CareTEA" />
          </a>

          <nav
            className="landing-header-nav"
            aria-label="Navegação principal"
          >
            <a href="#inicio">Início</a>
            <a href="#funcionalidades">Funcionalidades</a>
            <a href="#para-quem">Para quem é</a>
            <a href="#autonomia">Níveis de autonomia</a>
            <a href="#sobre">Sobre nós</a>
          </nav>

          <div className="landing-header-actions">
            <Link
              to="/login"
              className="landing-header-button landing-login-button"
            >
              Entrar
            </Link>

            <Link
              to="/cadastro"
              className="landing-header-button landing-register-button"
            >
              Cadastrar-se
            </Link>
          </div>
        </div>
      </header>

      <div className="landing-spectrum-strip">
        <PuzzleStrip />
      </div>
    </div>
  );
}

export default Header;