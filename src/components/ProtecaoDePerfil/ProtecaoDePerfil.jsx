import { Navigate } from "react-router-dom";
import { getCareteaSession } from "../../utils/careteaSession.js";

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
