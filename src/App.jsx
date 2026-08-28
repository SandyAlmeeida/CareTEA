import { Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/agenda" element={<Agenda />} />
      <Route path="/relatorios" element={<Relatorios />} />
      <Route path="/documentos" element={<Documentos />} />

      <Route path="/reset-password" element={<EsqueciSenha />} />
      <Route
        path="/create-new-password"
        element={<CriarNovaSenha />}
      />
      <Route path="/consultas" element={<Consultas />} />
      <Route path="/medicamentos" element={<Medicamentos />} />
    </Routes>
  );
}

export default App;