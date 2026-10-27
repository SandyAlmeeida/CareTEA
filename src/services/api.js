const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

async function extrairErro(resposta) {
  try {
    const corpo = await resposta.json();
    return corpo.mensagem || corpo.erro || `Erro ${resposta.status}`;
  } catch {
    return `Erro ${resposta.status}`;
  }
}

export async function apiRequest(caminho, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });

  if (!resposta.ok) {
    throw new Error(await extrairErro(resposta));
  }

  if (resposta.status === 204) {
    return null;
  }

  return resposta.json();
}

export const api = {
  get: (caminho) => apiRequest(caminho, { method: "GET" }),
  post: (caminho, corpo) =>
    apiRequest(caminho, { method: "POST", body: JSON.stringify(corpo) }),
  put: (caminho, corpo) =>
    apiRequest(caminho, { method: "PUT", body: JSON.stringify(corpo) }),
  remove: (caminho) => apiRequest(caminho, { method: "DELETE" }),
};

export { API_URL };
