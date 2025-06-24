import React, { useState, useEffect } from "react";
import PecaService from "../services/pecaService";
import Modal from "../components/Modal";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./Pecas.css";

const Pecas = () => {
  const [pecas, setPecas] = useState([]);
  const [pecaSelecionada, setPecaSelecionada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  useEffect(() => {
    carregarPecas();
  }, []);

  const carregarPecas = async () => {
    try {
      const dados = await PecaService.listarTodos();
      setPecas(dados);
    } catch (error) {
      console.error("Erro ao carregar peças:", error);
    }
  };

  const abrirModalEdicao = (peca) => {
    setPecaSelecionada({
      ...peca,
      preco: peca.preco.toString(),
      ano: peca.ano.toString(),
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const abrirModalNova = () => {
    setPecaSelecionada({
      nome: "",
      descricao: "",
      preco: "",
      montadora: "",
      modelo: "",
      ano: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleSalvar = async () => {
    const { nome, descricao, preco, montadora, modelo, ano, codPeca } =
      pecaSelecionada;

    if (!nome || !descricao || !montadora || !modelo || !ano || preco === "") {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const dadosFormatados = {
      nome,
      descricao,
      montadora,
      modelo,
      ano: parseInt(ano),
      preco: parseFloat(preco),
    };

    try {
      if (isEditing) {
        await PecaService.atualizar(codPeca, { codPeca, ...dadosFormatados });
        setPecas(
          pecas.map((p) =>
            p.codPeca === codPeca ? { codPeca, ...dadosFormatados } : p
          )
        );
      } else {
        const nova = await PecaService.salvar(dadosFormatados);
        setPecas([...pecas, nova]);
      }

      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar peça:", error);
    }
  };

  const handleExcluir = async (codPeca) => {
    if (!window.confirm("Tem certeza que deseja excluir esta peça?")) return;
    try {
      await PecaService.deletar(codPeca);
      setPecas(pecas.filter((p) => p.codPeca !== codPeca));
    } catch (error) {
      console.error("Erro ao excluir peça:", error);
    }
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setPecaSelecionada(null);
    setIsEditing(false);
  };

  const pecasFiltradas = pecas.filter(
    (p) =>
      p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      p.montadora.toLowerCase().includes(termoBusca.toLowerCase()) ||
      p.modelo.toLowerCase().includes(termoBusca.toLowerCase()) ||
      String(p.ano).includes(termoBusca)
  );

  return (
    <div className="pecas-container">
      <h1>Gestão de Peças</h1>

      <div className="pecas-header">
        <button className="add-btn" onClick={abrirModalNova}>
          <FaPlus /> Nova Peça
        </button>
      </div>
       <input
            type="text"
            placeholder="Buscar por nome, montadora, modelo ou ano..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="search-bar"
        />
    

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
          {pecasFiltradas.length > 0 ? (
            pecasFiltradas.map((peca) => (
              <tr key={peca.codPeca}>
                <td>{peca.codPeca}</td>
                <td>{peca.nome}</td>
                <td>{peca.montadora}</td>
                <td>{peca.modelo}</td>
                <td>{peca.ano}</td>
                <td>{peca.descricao}</td>
                <td>R$ {parseFloat(peca.preco).toFixed(2)}</td>
                <td className="action-buttons">
                  <button
                    className="icon-btn edit-btn"
                    onClick={() => abrirModalEdicao(peca)}
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="icon-btn delete-btn"
                    onClick={() => handleExcluir(peca.codPeca)}
                    title="Excluir"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                Nenhuma peça encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={fecharModal}>
        <h2>{isEditing ? "Editar Peça" : "Nova Peça"}</h2>
        {pecaSelecionada && (
          <div className="modal-form">
            <input
              type="text"
              placeholder="Nome"
              value={pecaSelecionada.nome}
              onChange={(e) =>
                setPecaSelecionada({ ...pecaSelecionada, nome: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Montadora"
              value={pecaSelecionada.montadora}
              onChange={(e) =>
                setPecaSelecionada({
                  ...pecaSelecionada,
                  montadora: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Modelo"
              value={pecaSelecionada.modelo}
              onChange={(e) =>
                setPecaSelecionada({
                  ...pecaSelecionada,
                  modelo: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="Ano"
              min="1900"
              value={pecaSelecionada.ano}
              onChange={(e) =>
                setPecaSelecionada({ ...pecaSelecionada, ano: e.target.value })
              }
            />
            <textarea
              placeholder="Descrição"
              value={pecaSelecionada.descricao}
              onChange={(e) =>
                setPecaSelecionada({
                  ...pecaSelecionada,
                  descricao: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="Preço"
              step="0.01"
              min="0"
              value={pecaSelecionada.preco}
              onChange={(e) =>
                setPecaSelecionada({
                  ...pecaSelecionada,
                  preco: e.target.value,
                })
              }
            />
            <button onClick={handleSalvar}>
              {isEditing ? "💾 Salvar Alterações" : "✅ Adicionar Peça"}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Pecas;
