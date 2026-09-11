import { Routes, Route, useNavigate } from "react-router-dom";

import Notificacoes from "./pages/Notificacoes/Notificacoes.jsx";
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

  function handleNavigate(id) {
    const routes = {
      dashboard: "/dashboard",
      agenda: "/agenda",
      medicamentos: "/medicamentos",
      consultas: "/consultas",
      documentos: "/documentos",
      relatorios: "/relatorios",
      assistente: "/assistente",
      notificacoes: "/notificacoes",
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
       <Route
       path="/notificacoes"element={<ProtecaoDePerfil>
       <Notificacoes onNavigate={handleNavigate} />
       </ProtecaoDePerfil>
         }
       />

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/reset-password" element={<EsqueciSenha />} />
        <Route
          path="/create-new-password"
          element={<CriarNovaSenha />}
        />

        <Route path="/acesso-meu-dia" element={<AcessoMeuDia />} />
        <Route path="/meu-dia" element={<DashboardAutista />} />

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
          path="/assistente"
          element={
            <ProtecaoDePerfil>
              <Assistente />
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