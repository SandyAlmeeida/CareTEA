import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Cadastro from "./pages/Cadastro/Cadastro.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Relatorios from "./pages/Relatorios/Relatorios.jsx";
import Home from "./pages/Home/Home.jsx";
import Header from "./components/Header/Header.jsx";
import EsqueciSenha from "./pages/EsqueciSenha/EsqueciSenha.jsx";
import CriarNovaSenha from "./pages/EsqueciSenha/CriarNovaSenha.jsx";

function App() {

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/cadastro" element={<Cadastro />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/reset-password" element={<EsqueciSenha />}></Route>
        <Route path="/create-new-password" element={<CriarNovaSenha />}></Route>
      </Routes>
    </>
  );
}

export default App;
