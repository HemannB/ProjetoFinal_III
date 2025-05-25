import React, { useState, useEffect } from 'react';
import EstoqueService from '../services/estoqueService';
import PecaService from '../services/pecaService';
import Modal from '../components/Modal';
import './Estoque.css';

const Estoque = () => {
    const [estoque, setEstoque] = useState([]);
    const [pecas, setPecas] = useState([]);
    const [novaEntrada, setNovaEntrada] = useState({ cod_peca: "", quantidade: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const [estoqueData, pecasData] = await Promise.all([
                EstoqueService.listarTodos(),
                PecaService.listarTodos()
            ]);
            setEstoque(estoqueData);
            setPecas(pecasData);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    };

    const handleAddEstoque = async () => {
        try {
            if (!novaEntrada.cod_peca || !novaEntrada.quantidade) {
                alert("Preencha todos os campos antes de salvar.");
                return;
            }

            const payload = {
                cod_peca: Number(novaEntrada.cod_peca),
                quantidade: Number(novaEntrada.quantidade)
            };

            if (isNaN(payload.cod_peca) || isNaN(payload.quantidade)) {
                alert("Valores inválidos. Verifique os campos.");
                return;
            }

            console.log("Payload enviado:", payload);

            const novoEstoque = await EstoqueService.salvar(payload);
            setEstoque([...estoque, novoEstoque]);

            setNovaEntrada({ cod_peca: "", quantidade: "" });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erro ao salvar no estoque:", error.response?.data || error);
            alert("Erro ao salvar no estoque: " + (error.response?.data?.mensagem || "Verifique o console para mais detalhes."));
        }
    };

    return (
        <div className="estoque-container">
            <h1>Controle de Estoque</h1>

            <button className="add-btn" onClick={() => setIsModalOpen(true)}>
                ➕ Adicionar ao Estoque
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>Nova Entrada de Estoque</h2>
                <div className="modal-form">
                    <select
                        value={novaEntrada.cod_peca}
                        onChange={e => setNovaEntrada({ ...novaEntrada, cod_peca: e.target.value })}
                    >
                        <option value="">Selecione uma peça</option>
                        {pecas.map(peca => (
                            <option key={peca.cod_peca} value={peca.cod_peca}>
                                {peca.nome} - {peca.fabricante}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Quantidade"
                        value={novaEntrada.quantidade}
                        onChange={e => setNovaEntrada({ ...novaEntrada, quantidade: e.target.value })}
                    />
                    <button onClick={handleAddEstoque}>Salvar</button>
                </div>
            </Modal>

            <table className="estoque-table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nome da Peça</th>
                        <th>Quantidade</th>
                    </tr>
                </thead>
                <tbody>
                    {estoque.map((item, index) => {
                        const peca = pecas.find(p => p.cod_peca === item.cod_peca);
                        return (
                            <tr key={item.cod_estoque || `${item.cod_peca}-${index}`}>
                                <td>{item.cod_peca}</td>
                                <td>{peca?.nome || "Peça não encontrada"}</td>
                                <td>{item.quantidade}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Estoque;
