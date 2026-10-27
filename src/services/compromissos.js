import { api } from "./api.js";

export function horaCurta(hora) {
  return hora ? String(hora).slice(0, 5) : "";
}

function montarQuery({ periodo, data, tipo, inicio, fim } = {}) {
  const params = new URLSearchParams();

  if (periodo) params.set("periodo", periodo);
  if (data) params.set("data", data);
  if (tipo) params.set("tipo", tipo);
  if (inicio) params.set("inicio", inicio);
  if (fim) params.set("fim", fim);

  const query = params.toString();
  return query ? `?${query}` : "";
}

function base(usuarioId) {
  return `/usuarios/${usuarioId}/compromissos`;
}

export function listarCompromissos(usuarioId, filtros) {
  return api.get(`${base(usuarioId)}${montarQuery(filtros)}`);
}

export function criarCompromisso(usuarioId, dados) {
  return api.post(base(usuarioId), dados);
}

export function atualizarCompromisso(usuarioId, id, dados) {
  return api.put(`${base(usuarioId)}/${id}`, dados);
}

export function excluirCompromisso(usuarioId, id) {
  return api.remove(`${base(usuarioId)}/${id}`);
}

export function paraEvento(compromisso) {
  return {
    id: compromisso.id,
    dataISO: compromisso.data,
    inicio: horaCurta(compromisso.horarioInicio),
    fim: horaCurta(compromisso.horarioFim),
    tipo: compromisso.tipo,
    titulo: compromisso.titulo,
    especialidade: compromisso.especialidade || "",
    local: compromisso.local || "",
    observacoes: compromisso.observacoes || "",
    lembrete: compromisso.lembrete,
  };
}
