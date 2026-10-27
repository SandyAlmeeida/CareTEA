import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./TemaCareTEA.css";

const STORAGE_KEY = "careteaTheme";

const LIGHT_ONLY_ROUTES = [
  "/",
  "/login",
  "/cadastro",
  "/reset-password",
  "/create-new-password",
];

function getInitialTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEY);

  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return "light";
}

function TemaCareTEA() {
  const location = useLocation();
  const [theme, setTheme] = useState(getInitialTheme);

  const isLightOnlyPage = LIGHT_ONLY_ROUTES.includes(location.pathname);

  useEffect(() => {
    if (isLightOnlyPage) {
      document.documentElement.setAttribute("data-caretea-theme", "light");
      return;
    }

    document.documentElement.setAttribute("data-caretea-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, isLightOnlyPage]);

  if (isLightOnlyPage) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <button
      className="caretea-theme-toggle"
      type="button"
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={isDark ? "Tema claro" : "Tema escuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span aria-hidden="true">{isDark ? "☀" : "☾"}</span>
    </button>
  );
}

export default TemaCareTEA;