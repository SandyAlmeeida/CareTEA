const MEU_DIA_SESSION_KEY = "careteaMeuDiaSession";

export function setMeuDiaSession(data) {
  if (!data?.token) {
    return;
  }

  const session = {
    token: data.token,
    pessoaAutistaId: data.pessoaAutistaId,
    nomePessoaAutista: data.nomePessoaAutista,
    nivelAutismo: data.nivelAutismo,
    tokenExpiraEm: data.tokenExpiraEm,
  };

  localStorage.setItem(
    MEU_DIA_SESSION_KEY,
    JSON.stringify(session),
  );
}

export function getMeuDiaSession() {
  const raw = localStorage.getItem(
    MEU_DIA_SESSION_KEY,
  );

  if (!raw) {
    return null;
  }

  try {
    const session = JSON.parse(raw);

    if (!session?.token) {
      clearMeuDiaSession();
      return null;
    }

    if (session.tokenExpiraEm) {
      const expiration = new Date(
        session.tokenExpiraEm,
      ).getTime();

      if (
        Number.isFinite(expiration) &&
        expiration <= Date.now()
      ) {
        clearMeuDiaSession();
        return null;
      }
    }

    return session;
  } catch {
    clearMeuDiaSession();
    return null;
  }
}

export function clearMeuDiaSession() {
  localStorage.removeItem(
    MEU_DIA_SESSION_KEY,
  );
}

export function hasMeuDiaSession() {
  return Boolean(
    getMeuDiaSession()?.token,
  );
}