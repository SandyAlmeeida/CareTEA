export function getCareteaSession() {
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