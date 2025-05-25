import React, { useState, useEffect } from 'react';
import OrcamentoService from '../services/orcamentoService'; 
import ClienteService from '../services/clienteService'; 
import Modal from '../components/Modal';
import './Orcamentos.css';

const Orcamentos = () => {
    const [orcamentos, setOrcamentos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [novoOrcamento, setNovoOrcamento] = useState({ cpf_cliente: "", valor_total: "", data_orcamento: "", observacoes: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);

  
    useEffect(() => {
        const fetchData = async () => {
            try {
                const orcamentosData = await OrcamentoService.listarTodos();
                setOrcamentos(orcamentosData);

                const clientesData = await ClienteService.listarTodos();
                setClientes(clientesData);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        };
        fetchData();
    }, []);

    const handleAddOrcamento = async () => {
        if (!novoOrcamento.cpf_cliente || !novoOrcamento.valor_total) return;
        try {
            await OrcamentoService.criarOrcamento(novoOrcamento);
            setOrcamentos([...orcamentos, novoOrcamento]);
            setNovoOrcamento({ cpf_cliente: "", valor_total: "", data_orcamento: "", observacoes: "" });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erro ao criar orçamento:", error);
        }
    };

    return (
        <div className="orcamentos-container">
            <h1>Gestão de Orçamentos</h1>

            <button className="add-btn" onClick={() => setIsModalOpen(true)}>➕ Criar Orçamento</button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
    <h2>Novo Orçamento</h2>
    <div className="modal-form">
        <select value={novoOrcamento.cpf_cliente} onChange={e => setNovoOrcamento({...novoOrcamento, cpf_cliente: e.target.value})}>
            <option value="">Selecione um cliente</option>
            {clientes.map(cliente => (
                <option key={cliente.cpf} value={cliente.cpf}>{cliente.nome} - {cliente.cpf}</option>
            ))}
        </select>
        <input type="number" placeholder="Valor Total" value={novoOrcamento.valor_total} onChange={e => setNovoOrcamento({...novoOrcamento, valor_total: e.target.value})} />
        <input type="date" value={novoOrcamento.data_orcamento} onChange={e => setNovoOrcamento({...novoOrcamento, data_orcamento: e.target.value})} />
        <textarea placeholder="Observações" value={novoOrcamento.observacoes} onChange={e => setNovoOrcamento({...novoOrcamento, observacoes: e.target.value})} />
        <button onClick={handleAddOrcamento}>Salvar</button>
    </div>
</Modal>

            <table className="orcamentos-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>CPF do Cliente</th>
                        <th>Data</th>
                        <th>Valor Total</th>
                        <th>Observações</th>
                    </tr>
                </thead>
                <tbody>
                    {orcamentos.map((orcamento, index) => (
                        <tr key={index}>
                            <td>{orcamento.id_orcamento}</td>
                            <td>{orcamento.cpf_cliente}</td>
                            <td>{orcamento.data_orcamento}</td>
                            <td>R$ {orcamento.valor_total.toFixed(2)}</td>
                            <td>{orcamento.observacoes || "Sem observações"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Orcamentos;