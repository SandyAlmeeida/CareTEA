import { Link } from "react-router-dom";
import logoCaretea from "../../assets/logo-caretea.png";
import "./Header.css";

function Header() {

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo">
                    <img src={logoCaretea} alt="CareTEA" />
                </Link>
                <nav className="header-nav">
                    <Link to="/" className="header-link">Início</Link>
                    <a className="header-link">Funcionalidades</a>
                    <a className="header-link">Para quem é</a>
                    <a className="header-link">Níveis de autonomia</a>
                    <a className="header-link">Sobre nós</a>
                    <a className="header-link">Contato</a>
                </nav>
                <div className="header-actions">
                    <Link to="/login" className="header-button" id="login-button">Entrar</Link>
                    <Link to="/cadastro" className="header-button" id="register-button">Cadastrar-se</Link>
                    <Link to="/dashboard" className="header-button" id="register-button">Dashboard</Link>
                </div>
            </div>
        </header>
    );
}

export default Header;