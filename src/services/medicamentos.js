import { api, apiRequest } from "./api.js";

function base(usuarioId) {
  return `/usuarios/${usuarioId}/medicamentos`;
}

export function listarMedicamentos(usuarioId) {
  return api.get(base(usuarioId));
}

export function criarMedicamento(usuarioId, dados) {
  return api.post(base(usuarioId), dados);
}

export function atualizarMedicamento(usuarioId, id, dados) {
  return api.put(`${base(usuarioId)}/${id}`, dados);
}

export function excluirMedicamento(usuarioId, id) {
  return api.remove(`${base(usuarioId)}/${id}`);
}

export function registrarMedicamentoTomado(usuarioId, id) {
  return apiRequest(`${base(usuarioId)}/${id}/tomado`, { method: "PATCH" });
}

export function listarHistoricoMedicamentos(usuarioId) {
  return api.get(`${base(usuarioId)}/historico`);
}
