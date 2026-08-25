import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Painel.css";

function Painel() {
    return <div className="painel">
    <Sidebar />
    <main className="dashboard-content">
        <Outlet />
    </main>
    </div>
}

export default Painel;