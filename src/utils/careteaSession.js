export function getCareteaSession() {
  const rawSession =
    sessionStorage.getItem("careteaSession") ||
    localStorage.getItem("careteaSession");

  if (!rawSession) {
    return null;
  }

  try {
    const session = JSON.parse(rawSession);

    if (
      !session ||
      session.userId == null ||
      !tokenEstaValido(session.token, session.userId)
    ) {
      clearCareteaSession();
      return null;
    }

    return session;
  } catch {
    clearCareteaSession();
    return null;
  }
}

function tokenEstaValido(token, usuarioId) {
  if (typeof token !== "string" || !token) {
    return false;
  }

  try {
    const partes = token.split(".");

    if (partes.length !== 3) {
      return false;
    }

    const payloadBase64 = partes[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const padding = (4 - (payloadBase64.length % 4)) % 4;
    const payload = JSON.parse(
      atob(`${payloadBase64}${"=".repeat(padding)}`)
    );

    return (
      typeof payload.exp === "number" &&
      Date.now() < payload.exp * 1000 &&
      String(payload.sub) === String(usuarioId)
    );
  } catch {
    return false;
  }
}

export function getCareteaProfile() {
  const session = getCareteaSession();

  if (!session) {
    return null;
  }

  const accountType = session.accountType;
  const autismLevel = Number(session.autismLevel);
  const isResponsible = accountType === "responsavel";

  return {
    accountType,
    autismLevel,
    isResponsible,
    userName: session.userName,
    profileName: session.profileName,
    userLevel: isResponsible
      ? `Responsável · Nível ${autismLevel}`
      : `Nível ${autismLevel} · Autonomia`,
    dashboardSubtitle: isResponsible
      ? `Acompanhando a rotina de ${session.profileName}.`
      : "Sua rotina, cuidados e compromissos em um só lugar.",
  };
}

export function clearCareteaSession() {
  sessionStorage.removeItem("careteaSession");
  localStorage.removeItem("careteaSession");
}
