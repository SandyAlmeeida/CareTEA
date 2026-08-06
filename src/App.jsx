
import { useState } from "react";
import Login from "./pages/Login/Login.jsx";
import Cadastro from "./pages/Cadastro/Cadastro.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Relatorios from "./pages/Relatorios/Relatorios.jsx";

function App() {
  const [pagina, setPagina] = useState("login");

  async function handleLogin(credentials) {
    console.log("Dados do login:", credentials);
    setPagina("dashboard");
  }

  async function handleCadastro(data) {
    console.log("Dados do cadastro:", data);
    setPagina("login");
  }

  function handleNavigate(nextPage) {
    if (["login", "cadastro", "dashboard", "relatorios"].includes(nextPage)) {
      setPagina(nextPage);
    }
  }

  if (pagina === "dashboard") {
    return <Dashboard onNavigate={handleNavigate} onLogout={() => setPagina("login")} />;
  }

  if (pagina === "relatorios") {
    return <Relatorios onNavigate={handleNavigate} onLogout={() => setPagina("login")} />;
  }

  if (pagina === "cadastro") {
    return (
      <Cadastro
        onSubmit={handleCadastro}
        onGoogleRegister={() => console.log("Cadastro com Google")}
        onBackToLogin={() => setPagina("login")}
      />
    );
  }

  return (
    <Login
      onLogin={handleLogin}
      onForgotPassword={() => console.log("Recuperar senha")}
      onGoogleLogin={() => console.log("Login com Google")}
      onRegister={() => setPagina("cadastro")}
    />
  );
}

export default App;
