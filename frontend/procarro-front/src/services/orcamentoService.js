import axios from "axios";

const API_URL = "http://localhost:8080/api/orcamentos";

const OrcamentoService = {
    listarTodos: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar orçamentos:", error);
            throw error;
        }
    },

    buscarPorId: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar orçamento:", error);
            throw error;
        }
    },

    salvar: async (orcamentoData) => {
        try {
            const response = await axios.post(API_URL, orcamentoData);
            return response.data;
        } catch (error) {
            console.error("Erro ao salvar orçamento:", error);
            throw error;
        }
    }
};

export default OrcamentoService;