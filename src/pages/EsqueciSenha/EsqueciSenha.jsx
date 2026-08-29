import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import "./EsqueciSenha.css";

function EsqueciSenha() {
    const navigate = useNavigate();

    const [emailPreenchido, setEmailPreenchido] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

    async function verificaEmail(e) {
        e.preventDefault();
        alert(`E-mail para recuperação de senha enviado.
Cheque sua caixa de e-mail`)
        console.log("Recuperou senha, eba!");
        navigate("/create-new-password");
    }

    return (
        <main className="reset">
            <header className="login-header">
                <h2 id="login-title">
                    Recuperar sua <span>senha</span>
                </h2>
            </header>
            <form onSubmit={verificaEmail}>
                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <div className="input-box">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <path d="m3 7 9 6 9-6" />
                        </svg>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="reset-button">Recuperar Senha</button>
                </div>
            </form>

            <Footer />
        </main>
    )
}

export default EsqueciSenha