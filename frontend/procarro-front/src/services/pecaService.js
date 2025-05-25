import axios from "axios";

const API_URL = "http://localhost:8080/api/pecas";

const PecaService = {
    listarTodos: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },
    

    buscarPorId: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    salvar: async (pecaData) => {
        const response = await axios.post(API_URL, pecaData);
        return response.data;
    },

    atualizar: async (id, pecaData) => {
        const response = await axios.put(`${API_URL}/${id}`, pecaData);
        return response.data;
    },

    deletar: async (id) => {
        await axios.delete(`${API_URL}/${id}`);
    }
};

export default PecaService;
