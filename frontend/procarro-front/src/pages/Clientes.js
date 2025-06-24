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
    const [termoBusca, setTermoBusca] = useState("");

    useEffect(() => {
        ClienteService.listarTodos().then(setClientes);
    }, []);

    const abrirModal = (cliente = null) => {
        setClienteSelecionado(
            cliente ?? {
                cpf: "",
                nome: "",
                sobrenome: "",
                telefone: "",
                email: "",
                endereco_completo: "",
            }
        );
        setIsEditing(!!cliente);
        setIsModalOpen(true);
    };

    const fecharModal = () => {
        setIsModalOpen(false);
        setClienteSelecionado(null);
        setIsEditing(false);
    };

    const handleSalvar = async () => {
        if (!clienteSelecionado?.cpf) return;

        try {
            if (isEditing) {
                await ClienteService.atualizarCliente(
                    clienteSelecionado.cpf,
                    clienteSelecionado
                );
                setClientes((prev) =>
                    prev.map((c) =>
                        c.cpf === clienteSelecionado.cpf
                            ? clienteSelecionado
                            : c
                    )
                );
            } else {
                const novoCliente = await ClienteService.criarCliente(
                    clienteSelecionado
                );
                setClientes((prev) => [...prev, novoCliente]);
            }
            fecharModal();
        } catch (error) {
            alert("Erro ao salvar cliente.");
        }
    };

    const handleExcluir = async (cpf) => {
        try {
            await ClienteService.deletarCliente(cpf);
            setClientes((prev) => prev.filter((c) => c.cpf !== cpf));
        } catch {
            alert("Erro ao excluir cliente.");
        }
    };

    const clientesFiltrados = clientes.filter((cliente) =>
        `${cliente.nome} ${cliente.sobrenome} ${cliente.cpf} ${cliente.telefone} ${cliente.email} ${cliente.endereco_completo}`
            .toLowerCase()
            .includes(termoBusca.toLowerCase())
    );

    return (
        <div className="clientes-container">
            <h1>Gestão de Clientes</h1>

            <button className="add-btn" onClick={() => abrirModal()}>
                Novo Cliente
            </button>

                <input
                    type="text"
                    placeholder="Buscar por nome, CPF, telefone, email ou endereço..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    className="search-bar"
                />
            

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
                    {clientesFiltrados.length > 0 ? (
                        clientesFiltrados.map((cliente) => (
                            <tr key={cliente.cpf}>
                                <td>{cliente.cpf}</td>
                                <td>{cliente.nome} {cliente.sobrenome}</td>
                                <td>{cliente.telefone}</td>
                                <td>{cliente.email}</td>
                                <td>{cliente.endereco_completo}</td>
                                <td className="action-buttons">
                                    <button
                                        className="icon-btn edit-btn"
                                        onClick={() => abrirModal(cliente)}
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="icon-btn delete-btn"
                                        onClick={() => handleExcluir(cliente.cpf)}
                                        title="Excluir"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>
                                Nenhum cliente encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Modal isOpen={isModalOpen} onClose={fecharModal}>
                <h2>{isEditing ? "Editar Cliente" : "Novo Cliente"}</h2>
                {clienteSelecionado && (
                    <div className="modal-form">
                        <input
                            type="text"
                            placeholder="CPF"
                            value={clienteSelecionado.cpf}
                            onChange={(e) =>
                                setClienteSelecionado({
                                    ...clienteSelecionado,
                                    cpf: e.target.value,
                                })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Nome"
                            value={clienteSelecionado.nome}
                            onChange={(e) =>
                                setClienteSelecionado({
                                    ...clienteSelecionado,
                                    nome: e.target.value,
                                })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Sobrenome"
                            value={clienteSelecionado.sobrenome}
                            onChange={(e) =>
                                setClienteSelecionado({
                                    ...clienteSelecionado,
                                    sobrenome: e.target.value,
                                })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Telefone"
                            value={clienteSelecionado.telefone}
                            onChange={(e) =>
                                setClienteSelecionado({
                                    ...clienteSelecionado,
                                    telefone: e.target.value,
                                })
                            }
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={clienteSelecionado.email}
                            onChange={(e) =>
                                setClienteSelecionado({
                                    ...clienteSelecionado,
                                    email: e.target.value,
                                })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Endereço"
                            value={clienteSelecionado.endereco_completo}
                            onChange={(e) =>
                                setClienteSelecionado({
                                    ...clienteSelecionado,
                                    endereco_completo: e.target.value,
                                })
                            }
                        />
                        <button
                            onClick={handleSalvar}
                            disabled={!clienteSelecionado.cpf}
                        >
                            {isEditing
                                ? "💾 Salvar Alterações"
                                : "✅ Adicionar Cliente"}
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Clientes;
