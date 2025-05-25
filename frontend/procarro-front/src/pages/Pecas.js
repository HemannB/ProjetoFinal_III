import React, { useState, useEffect } from "react";
import PecaService from "../services/pecaService";
import Modal from "../components/Modal";
import "./Pecas.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const Pecas = () => {
    const [pecas, setPecas] = useState([]);
    const [pecaSelecionada, setPecaSelecionada] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchPecas = async () => {
            try {
                const pecasData = await PecaService.listarTodos();
                setPecas(pecasData);
            } catch (error) {
                console.error("Erro ao carregar peças:", error);
            }
        };
        fetchPecas();
    }, []);

    const handleEditPeca = (peca) => {
        setPecaSelecionada({ ...peca, preco: peca.preco.toString() });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleAddPeca = async () => {
        try {
            const novaPeca = {
                nome: pecaSelecionada.nome,
                descricao: pecaSelecionada.descricao,
                preco: parseFloat(pecaSelecionada.preco),
                montadora: pecaSelecionada.montadora,
                modelo: pecaSelecionada.modelo,
                ano: parseInt(pecaSelecionada.ano)
            };
            const response = await PecaService.salvar(novaPeca);
            setPecas([...pecas, response]);
            setIsModalOpen(false);
            setPecaSelecionada(null);
        } catch (error) {
            console.error("Erro ao adicionar peça:", error);
        }
    };

    const handleSavePeca = async () => {
        if (!pecaSelecionada) return;
        try {
            const pecaAtualizada = {
                ...pecaSelecionada,
                preco: parseFloat(pecaSelecionada.preco),
                ano: parseInt(pecaSelecionada.ano)
            };
            await PecaService.atualizar(pecaSelecionada.codPeca, pecaAtualizada);
            setPecas(pecas.map((p) => (p.codPeca === pecaSelecionada.codPeca ? pecaAtualizada : p)));
            setIsModalOpen(false);
            setPecaSelecionada(null);
            setIsEditing(false);
        } catch (error) {
            console.error("Erro ao atualizar peça:", error);
        }
    };

    const handleDeletePeca = async (codPeca) => {
        try {
            await PecaService.deletar(codPeca);
            setPecas(pecas.filter((peca) => peca.codPeca !== codPeca));
        } catch (error) {
            console.error("Erro ao excluir peça:", error);
        }
    };

    return (
        <div className="pecas-container">
            <h1>Gestão de Peças</h1>
            <button
                className="add-btn"
                onClick={() => {
                    setPecaSelecionada({
                        nome: "",
                        descricao: "",
                        preco: "",
                        montadora: "",
                        modelo: "",
                        ano: ""
                    });
                    setIsEditing(false);
                    setIsModalOpen(true);
                }}
            >
                ➕ Nova Peça
            </button>
            <table className="pecas-table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Montadora</th>
                        <th>Modelo</th>
                        <th>Ano</th>
                        <th>Descrição</th>
                        <th>Preço</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {pecas.map((peca, index) => (
                        <tr key={index}>
                            <td>{peca.codPeca}</td>
                            <td>{peca.nome}</td>
                            <td>{peca.montadora}</td>
                            <td>{peca.modelo}</td>
                            <td>{peca.ano}</td>
                            <td>{peca.descricao}</td>
                            <td>R$ {parseFloat(peca.preco).toFixed(2)}</td>
                            <td className="action-buttons">
                                <button className="icon-btn edit-btn" onClick={() => handleEditPeca(peca)} title="Editar">
                                    <FaEdit />
                                </button>
                                <button className="icon-btn delete-btn" onClick={() => handleDeletePeca(peca.codPeca)} title="Excluir">
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>{isEditing ? "Editar Peça" : "Nova Peça"}</h2>
                {pecaSelecionada && (
                    <div className="modal-form">
                        <input
                            type="text"
                            placeholder="Nome"
                            value={pecaSelecionada.nome}
                            onChange={(e) => setPecaSelecionada({ ...pecaSelecionada, nome: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Montadora"
                            value={pecaSelecionada.montadora}
                            onChange={(e) => setPecaSelecionada({ ...pecaSelecionada, montadora: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Modelo"
                            value={pecaSelecionada.modelo}
                            onChange={(e) => setPecaSelecionada({ ...pecaSelecionada, modelo: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Ano"
                            value={pecaSelecionada.ano}
                            onChange={(e) => setPecaSelecionada({ ...pecaSelecionada, ano: e.target.value })}
                        />
                        <textarea
                            placeholder="Descrição"
                            value={pecaSelecionada.descricao}
                            onChange={(e) => setPecaSelecionada({ ...pecaSelecionada, descricao: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Preço"
                            value={pecaSelecionada.preco}
                            step="0.01"
                            min="0"
                            onChange={(e) => setPecaSelecionada({ ...pecaSelecionada, preco: e.target.value })}
                        />
                        <button
                            onClick={isEditing ? handleSavePeca : handleAddPeca}
                            disabled={!pecaSelecionada?.nome || pecaSelecionada.preco === ""}
                        >
                            {isEditing ? "💾 Salvar Alterações" : "✅ Adicionar Peça"}
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Pecas;
