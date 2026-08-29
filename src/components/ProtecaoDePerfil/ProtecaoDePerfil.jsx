import { Navigate } from "react-router-dom";

function getCareteaSession() {
  const rawSession =
    sessionStorage.getItem("careteaSession") ||
    localStorage.getItem("careteaSession");

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession);
  } catch {
    sessionStorage.removeItem("careteaSession");
    localStorage.removeItem("careteaSession");
    return null;
  }
}

function ProtecaoDePerfil({
  children,
  accountType,
  autismLevel,
  requireLogin = true,
}) {
  const session = getCareteaSession();

  if (requireLogin && !session) {
    return <Navigate to="/login" replace />;
  }

  if (!session) {
    return children;
  }

  if (accountType && session.accountType !== accountType) {
    return <Navigate to="/dashboard" replace />;
  }

  if (
    autismLevel !== undefined &&
    Number(session.autismLevel) !== Number(autismLevel)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtecaoDePerfil;
