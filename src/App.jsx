import { Routes, Route, useNavigate } from "react-router-dom";

import AcessoMeuDia from "./pages/AcessoMeuDia/AcessoMeuDia.jsx";
import DashboardAutista from "./pages/DashboardAutista/DashboardAutista.jsx";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Cadastro from "./pages/Cadastro/Cadastro.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Agenda from "./pages/Agenda/Agenda.jsx";
import Relatorios from "./pages/Relatorios/Relatorios.jsx";
import EsqueciSenha from "./pages/EsqueciSenha/EsqueciSenha.jsx";
import CriarNovaSenha from "./pages/EsqueciSenha/CriarNovaSenha.jsx";
import Documentos from "./pages/Documentos/Documentos.jsx";
import Notificacoes from "./pages/Notificacoes/Notificacoes.jsx";
import Consultas from "./pages/Consultas/Consultas.jsx";
import Medicamentos from "./pages/Medicamentos/Medicamentos.jsx";
import GerenciarMeuDia from "./pages/GerenciarMeuDia/GerenciarMeuDia.jsx";
import BemEstar from "./pages/BemEstar/BemEstar.jsx";
import Configuracoes from "./pages/Configuracoes/Configuracoes.jsx";
import Assistente from "./pages/Assistente/Assistente.jsx";
import ProtecaoDePerfil from "./components/ProtecaoDePerfil/ProtecaoDePerfil.jsx";
import TemaCareTEA from "./components/TemaCareTEA/TemaCareTEA.jsx";

function App() {
  const navigate = useNavigate();

  async function handleCadastro(dados) {
    const enviarNotificacoesResponsavel =
      dados.accountType === "autista" &&
      Boolean(dados.trustedWhatsapp) &&
      Boolean(dados.notifyMedication || dados.notifyAppointments);

    const resposta = await fetch("http://localhost:8080/usuarios/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: dados.fullName,
        email: dados.email,
        whatsapp: dados.whatsapp,
        senha: dados.password,
        tipoUsuario:
          dados.accountType === "responsavel" ? "RESPONSAVEL" : "AUTISTA",
        nivelAutismo: dados.autismLevel,
        nomePessoaAutista: dados.autisticPersonName,
        vinculoResponsavel:
          dados.accountType === "responsavel"
            ? dados.relationship
            : dados.trustedWhatsapp
              ? "Contato de confiança"
              : null,
        whatsappResponsavel:
          dados.accountType === "responsavel"
            ? dados.whatsapp
            : dados.trustedWhatsapp,
        enviarNotificacoesResponsavel,
      }),
    });

    if (!resposta.ok) {
      if (resposta.status === 409) {
        throw new Error("Este e-mail já está cadastrado.");
      }

      if (resposta.status === 400) {
        throw new Error("Confira os dados informados e tente novamente.");
      }

      throw new Error("Não foi possível concluir o cadastro.");
    }

    return resposta.json();
  }

  async function handleLogin(dados) {
    const resposta = await fetch("http://localhost:8080/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: dados.email, senha: dados.password }),
    });

    if (resposta.status === 401) {
      throw new Error("E-mail ou senha incorretos.");
    }

    if (!resposta.ok) {
      throw new Error("Não foi possível realizar o login.");
    }

    return resposta.json();
  }

  function handleNavigate(id) {
    const routes = {
      dashboard: "/dashboard",
      agenda: "/agenda",
      medicamentos: "/medicamentos",
      consultas: "/consultas",
      documentos: "/documentos",
      assistente: "/assistente",
      notificacoes: "/notificacoes",
      relatorios: "/relatorios",
      configuracoes: "/configuracoes",
      "gerenciar-meu-dia": "/gerenciar-meu-dia",
      "bem-estar": "/bem-estar",
    };

    const path = routes[id];

    if (path) {
      navigate(path);
    }
  }

  return (
    <>
      <TemaCareTEA />

      <Routes>
      {/* Páginas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/cadastro" element={<Cadastro onSubmit={handleCadastro} />} />
      <Route path="/reset-password" element={<EsqueciSenha />} />
      <Route
        path="/create-new-password"
        element={<CriarNovaSenha />}
      />

      {/* Acesso simplificado da pessoa autista Nível 2.
          Continua separado do login da conta principal. */}
      <Route path="/acesso-meu-dia" element={<AcessoMeuDia />} />
      <Route path="/meu-dia" element={<DashboardAutista />} />

      {/* Páginas da conta principal: exigem login */}
      <Route
        path="/dashboard"
        element={
          <ProtecaoDePerfil>
            <Dashboard onNavigate={handleNavigate} />
          </ProtecaoDePerfil>
        }
      />

      <Route
        path="/agenda"
        element={
          <ProtecaoDePerfil>
            <Agenda onNavigate={handleNavigate} />
          </ProtecaoDePerfil>
        }
      />

      <Route
        path="/relatorios"
        element={
          <ProtecaoDePerfil>
            <Relatorios onNavigate={handleNavigate} />
          </ProtecaoDePerfil>
        }
      />

      <Route
        path="/documentos"
        element={
          <ProtecaoDePerfil>
            <Documentos onNavigate={handleNavigate} />
          </ProtecaoDePerfil>
        }
      />

      <Route
        path="/notificacoes"
        element={
          <ProtecaoDePerfil>
            <Notificacoes onNavigate={handleNavigate} />
          </ProtecaoDePerfil>
        }
      />

      <Route
        path="/consultas"
        element={
          <ProtecaoDePerfil>
            <Consultas onNavigate={handleNavigate} />
          </ProtecaoDePerfil>
        }
      />

      <Route
        path="/medicamentos"
        element={
          <ProtecaoDePerfil>
            <Medicamentos onNavigate={handleNavigate} />
          </ProtecaoDePerfil>
        }
      />


      <Route
        path="/configuracoes"
        element={
          <ProtecaoDePerfil>
            <Configuracoes />
          </ProtecaoDePerfil>
        }
      />

      <Route
        path="/assistente"
        element={
          <ProtecaoDePerfil>
            <Assistente />
          </ProtecaoDePerfil>
        }
      />

      {/* Somente responsável de pessoa autista Nível 2 */}
      <Route
        path="/gerenciar-meu-dia"
        element={
          <ProtecaoDePerfil
            accountType="responsavel"
            autismLevel={2}
          >
            <GerenciarMeuDia onNavigate={handleNavigate} />
          </ProtecaoDePerfil>
        }
      />

      {/* Somente pessoa autista Nível 1 */}
      <Route
        path="/bem-estar"
        element={
          <ProtecaoDePerfil
            accountType="autista"
            autismLevel={1}
          >
            <BemEstar onNavigate={handleNavigate} />
          </ProtecaoDePerfil>
        }
      />
      </Routes>
    </>
  );
}

export default App;