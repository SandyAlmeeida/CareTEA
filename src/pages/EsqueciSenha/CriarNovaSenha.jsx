import { useState } from "react";
import Footer from "../../components/Footer/Footer";
import "./CriarNovaSenha.css"
import { useNavigate } from "react-router-dom";
function CriarNovaSenha() {

    const navigate = useNavigate();

    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [texto, setTexto] = useState("");

    async function criarNovaSenha(e) {
        e.preventDefault();
        console.log("Aqui faz as verificações se as senhas são iguais");
        if(novaSenha === confirmarNovaSenha) {
            alert("Senha alterada");
            navigate('/login');
        } else {
            setTexto("As senhas não são iguais");
        }
    }

    return (
        <main className="reset">
            <header className="login-header">
                <h2 id="login-title">
                    Recuperar sua <span>senha</span>
                </h2>
            </header>
            <form onSubmit={criarNovaSenha}>
                <div className="form-group">
                    <label htmlFor="password">Nova Senha</label>
                    <div className="input-box">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="5" y="10" width="14" height="10" rx="2" />
                            <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" />
                        </svg>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Digite sua senha"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            required
                        />

                        <button className={`password-toggle ${showPassword ? "visible" : ""}`} type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword(!showPassword)} >
                            <svg className="eye-open" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                                <circle cx="12" cy="12" r="2.7" />
                            </svg>
                            <svg className="eye-closed" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="m3 3 18 18M10.6 6.2A9 9 0 0 1 12 6c6 0 9.5 6 9.5 6a15 15 0 0 1-2.2 2.8M6.2 6.2C3.8 8 2.5 12 2.5 12s3.5 6 9.5 6a10 10 0 0 0 3.2-.5" />
                            </svg>
                        </button>
                    </div>

                    <label htmlFor="newPassword">Confirmar Nova Senha</label>
                    <div className="input-box">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="5" y="10" width="14" height="10" rx="2" />
                            <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" />
                        </svg>

                        <input
                            id="newPassword"
                            name="newPassword"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Confirmar senha"
                            value={confirmarNovaSenha}
                            onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                            required
                        />

                        <button className={`password-toggle ${showPassword ? "visible" : ""}`} type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword(!showPassword)}>
                            <svg className="eye-open" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                                <circle cx="12" cy="12" r="2.7" />
                            </svg>
                            <svg className="eye-closed" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="m3 3 18 18M10.6 6.2A9 9 0 0 1 12 6c6 0 9.5 6 9.5 6a15 15 0 0 1-2.2 2.8M6.2 6.2C3.8 8 2.5 12 2.5 12s3.5 6 9.5 6a10 10 0 0 0 3.2-.5" />
                            </svg>
                        </button>
                    </div>
                    <button type="submit" className="reset-button">Criar Nova Senha</button>
                    {texto && <p className="erro-reset">{texto}</p>}
                </div>
            </form>
            <Footer />
        </main>
    )
}

export default CriarNovaSenha;