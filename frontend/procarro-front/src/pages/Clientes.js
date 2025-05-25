import React, { useState, useEffect } from "react";
import ClienteService from "../services/clienteService";
import Modal from "../components/Modal";
import "./Clientes.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const clientesData = await ClienteService.listarTodos();
                setClientes(clientesData);
            } catch (error) {
                console.error("Erro ao carregar clientes:", error);
            }
        };
        fetchClientes();
    }, []);

    const handleEditCliente = (cliente) => {
        setClienteSelecionado(cliente);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleAddCliente = async () => {
        if (!clienteSelecionado?.cpf) return;

        try {
            const response = await ClienteService.criarCliente(clienteSelecionado);
            setClientes([...clientes, response]);
            setIsModalOpen(false);
            setClienteSelecionado({
                cpf: "",
                nome: "",
                sobrenome: "",
                telefone: "",
                email: "",
                endereco_completo: ""
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Erro ao adicionar cliente:", error);
        }
    };

    const handleSaveCliente = async () => {
        if (!clienteSelecionado) return;

        try {
            await ClienteService.atualizarCliente(clienteSelecionado.cpf, clienteSelecionado);
            setClientes(clientes.map(c => (c.cpf === clienteSelecionado.cpf ? clienteSelecionado : c)));
            setIsModalOpen(false);
            setClienteSelecionado(null);
            setIsEditing(false);
        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
        }
    };

    const handleDeleteCliente = async (cpf) => {
        try {
            await ClienteService.deletarCliente(cpf);
            setClientes(clientes.filter(cliente => cliente.cpf !== cpf));
        } catch (error) {
            console.error("Erro ao excluir cliente:", error);
        }
    };

    return (
        <div className="clientes-container">
            <h1>Gestão de Clientes</h1>
            <button
                className="add-btn"
                onClick={() => {
                    setClienteSelecionado({
                        cpf: "",
                        nome: "",
                        sobrenome: "",
                        telefone: "",
                        email: "",
                        endereco_completo: ""
                    });
                    setIsEditing(false);
                    setIsModalOpen(true);
                }}
            >
                ➕ Novo Cliente
            </button>
            <table className="clientes-table">
                <thead>
                    <tr>
                        <th>CPF</th>
                        <th>Nome Completo</th>
                        <th>Telefone</th>
                        <th>Email</th>
                        <th>Endereço</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente, index) => (
                        <tr key={index}>
                            <td>{cliente.cpf}</td>
                            <td>{cliente.nome} {cliente.sobrenome}</td>
                            <td>{cliente.telefone}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.endereco_completo}</td>
                            <td className="action-buttons">
                                <button className="icon-btn edit-btn" onClick={() => handleEditCliente(cliente)} title="Editar">
                                    <FaEdit />
                                </button>
                                <button className="icon-btn delete-btn" onClick={() => handleDeleteCliente(cliente.cpf)} title="Excluir">
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>{isEditing ? "Editar Cliente" : "Novo Cliente"}</h2>
                {clienteSelecionado && (
                    <div className="modal-form">
                        <input type="text" placeholder="CPF"
                            value={clienteSelecionado.cpf}
                            onChange={e => setClienteSelecionado({ ...clienteSelecionado, cpf: e.target.value })}
                            required />
                        <input type="text" placeholder="Nome"
                            value={clienteSelecionado.nome}
                            onChange={e => setClienteSelecionado({ ...clienteSelecionado, nome: e.target.value })} />
                        <input type="text" placeholder="Sobrenome"
                            value={clienteSelecionado.sobrenome}
                            onChange={e => setClienteSelecionado({ ...clienteSelecionado, sobrenome: e.target.value })} />
                        <input type="text" placeholder="Telefone"
                            value={clienteSelecionado.telefone}
                            onChange={e => setClienteSelecionado({ ...clienteSelecionado, telefone: e.target.value })} />
                        <input type="email" placeholder="Email"
                            value={clienteSelecionado.email}
                            onChange={e => setClienteSelecionado({ ...clienteSelecionado, email: e.target.value })} />
                        <input type="text" placeholder="Endereço"
                            value={clienteSelecionado.endereco_completo}
                            onChange={e => setClienteSelecionado({ ...clienteSelecionado, endereco_completo: e.target.value })} />
                        <button onClick={isEditing ? handleSaveCliente : handleAddCliente} disabled={!clienteSelecionado?.cpf}>
                            {isEditing ? "💾 Salvar Alterações" : "✅ Adicionar Cliente"}
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Clientes;