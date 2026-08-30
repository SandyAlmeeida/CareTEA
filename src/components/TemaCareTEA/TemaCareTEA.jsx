import { useEffect, useState } from "react";
import "./TemaCareTEA.css";

const STORAGE_KEY = "careteaTheme";

function getInitialTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEY);

  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return "light";
}

function TemaCareTEA() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-caretea-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

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
