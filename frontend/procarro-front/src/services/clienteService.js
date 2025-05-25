import axios from "axios";

const API_URL = "http://localhost:8080/api/clientes";

const ClienteService = {
    listarTodos: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar clientes:", error);
            throw error;
        }
    },

    buscarPorCpf: async (cpf) => {
        try {
            const response = await axios.get(`${API_URL}/${cpf}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
            throw error;
        }
    },

    criarCliente: async (clienteData) => {
        try {
            const response = await axios.post(API_URL, clienteData, {
                headers: { "Content-Type": "application/json" }
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao criar cliente:", error);
            throw error;
        }
    },

    atualizarCliente: async (cpf, clienteData) => {
        try {
            const response = await axios.put(`${API_URL}/${cpf}`, clienteData, {
                headers: { "Content-Type": "application/json" }
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
            throw error;
        }
    },

    deletarCliente: async (cpf) => {
        try {
            await axios.delete(`${API_URL}/${cpf}`);
        } catch (error) {
            console.error("Erro ao excluir cliente:", error);
            throw error;
        }
    }
};

export default ClienteService;