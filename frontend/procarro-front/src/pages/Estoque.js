import React, { useState, useEffect, useCallback, useMemo } from "react";
import EstoqueService from "../services/estoqueService";
import PecaService from "../services/pecaService";
import Modal from "../components/Modal";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Estoque.css";

const Estoque = () => {
  const [estoque, setEstoque] = useState([]);
  const [pecas, setPecas] = useState([]);
  const [filtro, setFiltro] = useState("");

  const [novaEntrada, setNovaEntrada] = useState({ codPeca: "", quantidade: "" });
  const [editarEntrada, setEditarEntrada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const carregarDados = useCallback(async () => {
    try {
      const [estoqueData, pecasData] = await Promise.all([
        EstoqueService.listarTodos(),
        PecaService.listarTodos(),
      ]);
      setEstoque(estoqueData);
      setPecas(pecasData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  useEffect(() => {
    if (editarEntrada) {
      setNovaEntrada({
        codPeca: editarEntrada.codPeca.toString(),
        quantidade: editarEntrada.quantidade.toString(),
      });
      setIsModalOpen(true);
    }
  }, [editarEntrada]);

  const resetForm = () => {
    setNovaEntrada({ codPeca: "", quantidade: "" });
    setEditarEntrada(null);
    setIsModalOpen(false);
  };

  const handleAddEstoque = async () => {
    const codPeca = parseInt(novaEntrada.codPeca, 10);
    const quantidade = parseInt(novaEntrada.quantidade, 10);

    if (isNaN(codPeca) || isNaN(quantidade) || codPeca <= 0 || quantidade <= 0) {
      alert("Selecione uma peça válida e informe uma quantidade maior que zero.");
      return;
    }

    try {
      const payload = { codPeca, quantidade };

      if (editarEntrada) {
        const atualizado = await EstoqueService.atualizar(editarEntrada.idEstoque, payload);
        setEstoque((prev) =>
          prev.map((item) => (item.idEstoque === editarEntrada.idEstoque ? atualizado : item))
        );
      } else {
        const duplicado = estoque.find((item) => item.codPeca === codPeca);
        if (duplicado) {
          alert("Esta peça já está no estoque. Edite a quantidade em vez de duplicar.");
          return;
        }

        const novoEstoque = await EstoqueService.salvar(payload);
        setEstoque((prev) => [...prev, novoEstoque]);
      }

      resetForm();
    } catch (error) {
      console.error("Erro ao salvar:", error.response?.data || error);
      alert("Erro ao salvar no estoque: " + (error.response?.data?.mensagem || "Verifique o console."));
    }
  };

  const handleExcluir = async (idEstoque) => {
    const confirmar = window.confirm("Deseja realmente excluir esta entrada de estoque?");
    if (!confirmar) return;

    try {
      await EstoqueService.excluir(idEstoque);
      setEstoque((prev) => prev.filter((item) => item.idEstoque !== idEstoque));
    } catch (error) {
      console.error("Erro ao excluir:", error.response?.data || error);
      alert("Erro ao excluir: " + (error.response?.data?.mensagem || "Verifique o console."));
    }
  };

  const estoqueFiltrado = useMemo(() => {
    const termo = filtro.toLowerCase();
    return estoque.filter((item) => {
      const peca = pecas.find((p) => p.codPeca === item.codPeca);
      return (
        item.codPeca.toString().includes(termo) ||
        peca?.nome?.toLowerCase().includes(termo) ||
        peca?.modelo?.toLowerCase().includes(termo) ||
        peca?.montadora?.toLowerCase().includes(termo)
      );
    });
  }, [estoque, pecas, filtro]);

  

  return (
    <div className="estoque-container">
      <h1>Controle de Estoque</h1>

      <div className="top-controls">
        
        <button className="add-btn" onClick={() => {
          setNovaEntrada({ codPeca: "", quantidade: "" });
          setEditarEntrada(null);
          setIsModalOpen(true);
        }}>
          ➕ Adicionar ao Estoque
        </button>

      </div>
<input
          className="filtro-input"
          type="text"
          placeholder="Buscar por nome, modelo, montadora ou código..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      <Modal isOpen={isModalOpen} onClose={resetForm}>
        <h2>{editarEntrada ? "Editar Estoque" : "Nova Entrada de Estoque"}</h2>
        <div className="modal-form">
          <select
            value={novaEntrada.codPeca}
            onChange={(e) => setNovaEntrada({ ...novaEntrada, codPeca: e.target.value })}
            disabled={!!editarEntrada}
          >
            <option value="">Selecione uma peça</option>
            {pecas.map((peca) => (
              <option key={peca.codPeca} value={peca.codPeca}>
                {peca.codPeca} - {peca.nome} - {peca.montadora} - {peca.modelo} - {peca.ano}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantidade"
            value={novaEntrada.quantidade}
            onChange={(e) => setNovaEntrada({ ...novaEntrada, quantidade: e.target.value })}
          />

          <button onClick={handleAddEstoque}>
            {editarEntrada ? "Salvar Alterações" : "Salvar"}
          </button>
        </div>
      </Modal>

      <table className="estoque-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome da Peça</th>
            <th>Montadora</th>
            <th>Modelo</th>
            <th>Ano</th>
            <th>Quantidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {estoqueFiltrado.map((item) => {
            const peca = pecas.find((p) => p.codPeca === item.codPeca);
            return (
              <tr key={item.idEstoque}>
                <td>{item.codPeca}</td>
                <td>{peca?.nome || "Peça não encontrada"}</td>
                <td>{peca?.montadora || "-"}</td>
                <td>{peca?.modelo || "-"}</td>
                <td>{peca?.ano || "-"}</td>
                <td>{item.quantidade}</td>
                <td>
                  <button className="edit-btn" onClick={() => setEditarEntrada(item)}><FaEdit /></button>
                  <button className="delete-btn" onClick={() => handleExcluir(item.idEstoque)}><FaTrash/> </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Estoque;
