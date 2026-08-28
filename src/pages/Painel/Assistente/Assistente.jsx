import { useState } from "react";
import "./Assistente.css";

function Assistente() {

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([{content: "Oi", type: "user"}, {content: "Tchau", type: "ai"}]);

    async function mandarMensagem(e, message) {
        e.preventDefault();

        if(!message.trim()) return;

        setMessages((prevMessages) => [
            ...prevMessages,
            {
                content: message,
                type: "user"
            }
        ]);

        setMessage("");
    }

    async function mensagemPadrao(mensagem) {

        setMessages((prevMessages) => [
            ...prevMessages,
            {
                content: mensagem,
                type: "user"
            }
        ]);

        setMessage("");
    }

    return (
        <main className="AI-main">
            <h1 className="AI-main-title">IA Assistente</h1>
            <div id="chat-AI" className="AI-chat">
                {messages.map((msg, index) => (
                    <p key={index} className={`AI-message AI-${msg.type}-message`}>{msg.content}</p>
                ))}
            </div>
            <div className="AI-sugestoes">
                <div className="AI-sugestao" onClick={(e) => mensagemPadrao(e.currentTarget.textContent)}>Qual é meu próximo compromisso?</div>
                <div className="AI-sugestao" onClick={(e) => mensagemPadrao(e.currentTarget.textContent)}>Quais medicamentos faltam hoje?</div>
                <div className="AI-sugestao" onClick={(e) => mensagemPadrao(e.currentTarget.textContent)}>O que diz esta receita?</div>
            </div>
            <form className="AI-form" onSubmit={(e) => mandarMensagem(e, message)}>
                <label className="AI-label" htmlFor="message">
                    <input type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    name="message"
                    id="message"
                    placeholder="Digite sua mensagem"
                    required/>
                    <button>Enviar</button>
                </label>
            </form>
        </main>
    )
}

export default Assistente;