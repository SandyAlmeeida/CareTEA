import { useEffect, useState } from "react";
import "./ModalNotificacoes.css";

const notificacoesIniciais = [
  {
    id: 1,
    icon: "◊",
    titulo: "Medicamento pendente",
    descricao: "Metilfenidato 10mg está programado para 12:00.",
    tempo: "Há 10 min",
    tipo: "purple",
    lida: false,
  },
  {
    id: 2,
    icon: "▣",
    titulo: "Consulta se aproximando",
    descricao: "Consulta com Neurologista hoje às 15:00.",
    tempo: "Há 25 min",
    tipo: "blue",
    lida: false,
  },
  {
    id: 3,
    icon: "♡",
    titulo: "Terapia hoje",
    descricao: "Fonoaudiologia marcada para hoje às 18:30.",
    tempo: "Há 1 hora",
    tipo: "orange",
    lida: false,
  },
  {
    id: 4,
    icon: "✓",
    titulo: "Medicamento registrado",
    descricao: "Risperidona marcada como tomada às 08:00.",
    tempo: "Hoje, 08:03",
    tipo: "green",
    lida: true,
  },
];

function ModalNotificacoes({
  aberto,
  onClose,
  onQuantidadeAlterada,
  onVerTodas,
}) {
  const [notificacoes, setNotificacoes] = useState(notificacoesIniciais);

  const naoLidas = notificacoes.filter((item) => !item.lida).length;

  useEffect(() => {
    onQuantidadeAlterada?.(naoLidas);
  }, [naoLidas, onQuantidadeAlterada]);

  useEffect(() => {
    function fecharComEsc(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (aberto) {
      window.addEventListener("keydown", fecharComEsc);
    }

    return () => {
      window.removeEventListener("keydown", fecharComEsc);
    };
  }, [aberto, onClose]);

  if (!aberto) {
    return null;
  }

  function marcarComoLida(id) {
    setNotificacoes((atuais) =>
      atuais.map((item) =>
        item.id === id ? { ...item, lida: true } : item,
      ),
    );
  }

  function marcarTodasComoLidas() {
    setNotificacoes((atuais) =>
      atuais.map((item) => ({
        ...item,
        lida: true,
      })),
    );
  }

  return (
    <>
      <button
        className="notification-backdrop"
        type="button"
        aria-label="Fechar notificações"
        onClick={onClose}
      />

      <section
        className="notification-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Notificações"
      >
        <header className="notification-modal-header">
          <div>
            <span>Central de avisos</span>
            <h2>Notificações</h2>
          </div>

          <button
            className="notification-close"
            type="button"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        <div className="notification-actions">
          <span>
            {naoLidas === 0
              ? "Tudo em dia"
              : `${naoLidas} ${naoLidas === 1 ? "nova" : "novas"}`}
          </span>

          {naoLidas > 0 && (
            <button type="button" onClick={marcarTodasComoLidas}>
              Marcar todas como lidas
            </button>
          )}
        </div>

        <div className="notification-list">
          {notificacoes.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`notification-item ${
                !item.lida ? "notification-item-unread" : ""
              }`}
              onClick={() => marcarComoLida(item.id)}
            >
              <span
                className={`notification-item-icon notification-item-${item.tipo}`}
              >
                {item.icon}
              </span>

              <span className="notification-item-content">
                <span className="notification-item-title-row">
                  <strong>{item.titulo}</strong>

                  {!item.lida && <i />}
                </span>

                <span className="notification-description">
                  {item.descricao}
                </span>

                <small>{item.tempo}</small>
              </span>

              <b>›</b>
            </button>
          ))}
        </div>

        <footer className="notification-modal-footer">
          <button
            type="button"
            onClick={() => {
              onClose();
              onVerTodas?.();
            }}
          >
            Ver todas as notificações
            <span>→</span>
          </button>
        </footer>
      </section>
    </>
  );
}

export default ModalNotificacoes;