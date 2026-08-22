import "./Topbar.css";

function Topbar({
  title = "Olá!",
  subtitle = "Vamos juntos tornar o dia de hoje mais leve e organizado.",
  userName = "Sandy",
  userLevel = "Nível 2 - Assistida",
  notifications = 3,
  onLogout,
}) {
  return (
    <header className="app-topbar">
      <div className="app-topbar-heading">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="app-topbar-actions">
        <button
          className="app-notification-button"
          type="button"
          aria-label="Notificações"
        >
          <span className="app-notification-icon">♢</span>

          {notifications > 0 && (
            <span className="app-notification-badge">
              {notifications}
            </span>
          )}
        </button>

        <button
          className="app-profile-button"
          type="button"
        >
          <span className="app-profile-avatar">
            {userName
              .split(" ")
              .map((name) => name[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </span>

          <span className="app-profile-copy">
            <strong>{userName}</strong>
            <small>{userLevel}</small>
          </span>

          <span className="app-profile-arrow">⌄</span>
        </button>

        {onLogout && (
          <button
            className="app-logout-button"
            type="button"
            onClick={onLogout}
          >
            Sair
          </button>
        )}
      </div>
    </header>
  );
}

export default Topbar;