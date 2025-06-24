import axios from "axios";

const API_URL = "http://localhost:8080/api/estoque";

const listarTodos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const salvar = async (estoqueData) => {
  const response = await axios.post(API_URL, estoqueData);
  return response.data;
};

const atualizar = async (idEstoque, estoqueData) => {
  const response = await axios.put(`${API_URL}/${idEstoque}`, estoqueData);
  return response.data;
};

const excluir = async (idEstoque) => {
  await axios.delete(`${API_URL}/${idEstoque}`);
};

const estoqueService = {
  listarTodos,
  salvar,
  atualizar,
  excluir,
}

export default estoqueService;
