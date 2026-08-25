import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Cadastro from "./pages/Cadastro/Cadastro.jsx";
import Dashboard from "./pages/Painel/Dashboard/Dashboard.jsx";
import Agenda from "./pages/Painel/Agenda/Agenda.jsx";
import Relatorios from "./pages/Painel/Relatorios/Relatorios.jsx";
import EsqueciSenha from "./pages/EsqueciSenha/EsqueciSenha.jsx";
import CriarNovaSenha from "./pages/EsqueciSenha/CriarNovaSenha.jsx";
import Painel from "./pages/Painel/Painel.jsx";
import Header from "./components/Header/Header.jsx";
import Medicamentos from "./pages/Painel/Medicamentos/Medicamentos.jsx";
import Consultas from "./pages/Painel/Consultas/Consultas.jsx";
import Exames from "./pages/Painel/Exames/Exames.jsx";
import Assistente from "./pages/Painel/Assistente/Assistente.jsx";
import Notificacoes from "./pages/Painel/Notificacoes/Notificacoes.jsx";
import Documentos from "./pages/Painel/Documentos/Documentos.jsx";
import Configuracoes from "./pages/Painel/Configuracoes/Configuracoes.jsx";

function App() {
  return (
    <>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route path="/reset-password" element={<EsqueciSenha />} />
      <Route path="/create-new-password" element={<CriarNovaSenha />} />

      <Route path="/painel" element={<Painel />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="medicamentos" element={<Medicamentos />} />
        <Route path="consultas" element={<Consultas />} />
        <Route path="exames" element={<Exames />} />
        <Route path="assistente" element={<Assistente />} />
        <Route path="notificacoes" element={<Notificacoes />} />
        <Route path="documentos" element={<Documentos />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="configuracoes" element={<Configuracoes />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

    </Routes>
    </>
  );
}

export default App;