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

export default {
    listarTodos,
    salvar
};
