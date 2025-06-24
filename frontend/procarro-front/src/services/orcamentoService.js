import axios from "axios";

const API_URL = "http://localhost:8080/api/orcamentos";

const OrcamentoService = {
    listarOrcamentos: async () => {
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
            console.error("Erro ao buscar orçamento por ID:", error);
            throw error;
        }
    },

    criarOrcamento: async (orcamentoData) => {
        try {
            const response = await axios.post(API_URL, orcamentoData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            const errorMsg = error.response?.data?.message || 
                            error.response?.data || 
                            error.message;
            console.error("Erro ao criar orçamento:", {
                message: errorMsg,
                status: error.response?.status,
                request: orcamentoData
            });
            throw new Error(errorMsg);
        }
    },

    aprovarOrcamento: async (id) => {
        try {
            const response = await axios.put(`${API_URL}/${id}/aprovar`);
            return response.data;
        } catch (error) {
            console.error("Erro ao aprovar orçamento:", error);
            throw error;
        }
    },

    cancelarOrcamento: async (id) => {
        try {
            await axios.put(`${API_URL}/${id}/cancelar`);
        } catch (error) {
            console.error("Erro ao cancelar orçamento:", error);
            throw error;
        }
    }
};

export default OrcamentoService;
