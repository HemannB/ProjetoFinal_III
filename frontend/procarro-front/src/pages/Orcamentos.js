import React, { useState, useEffect } from "react";
import OrcamentoService from "../services/orcamentoService";
import ClienteService from "../services/clienteService";
import PecaService from "../services/pecaService";
import EstoqueService from "../services/estoqueService";
import Modal from "../components/Modal";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Orcamentos.css";

const Orcamentos = () => {
  const [orcamentos, setOrcamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pecas, setPecas] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisualizarAberto, setModalVisualizarAberto] = useState(false);
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState(null);

  const [novoOrcamento, setNovoOrcamento] = useState({
    cpfCliente: "",
    observacoes: "",
    status: "PENDENTE",
    itens: [],
  });

  const [novoItem, setNovoItem] = useState({
    codPeca: "",
    quantidade: 1,
    precoUnitario: 0,
  });

  const valorTotal = novoOrcamento.itens.reduce(
    (total, item) => total + item.quantidade * item.precoUnitario,
    0
  );

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [orc, cli, pec, est] = await Promise.all([
          OrcamentoService.listarOrcamentos(),
          ClienteService.listarTodos(),
          PecaService.listarTodos(),
          EstoqueService.listarTodos(),
        ]);
        setOrcamentos(orc || []);
        setClientes(cli || []);
        setPecas(pec || []);
        setEstoque(est || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    carregarDados();
  }, []);

  const resetNovoOrcamento = () => {
    setNovoOrcamento({
      cpfCliente: "",
      observacoes: "",
      status: "PENDENTE",
      itens: [],
    });
    setNovoItem({ codPeca: "", quantidade: 1, precoUnitario: 0 });
  };

  const adicionarItemAoOrcamento = () => {
    const { codPeca, quantidade, precoUnitario } = novoItem;
    if (!codPeca || quantidade <= 0 || precoUnitario <= 0) return;

    setNovoOrcamento((prev) => ({
      ...prev,
      itens: [...prev.itens, { codPeca, quantidade, precoUnitario }],
    }));
    setNovoItem({ codPeca: "", quantidade: 1, precoUnitario: 0 });
  };

  const handleSalvarOrcamento = async () => {
    const { cpfCliente, itens } = novoOrcamento;
    if (!cpfCliente || itens.length === 0) {
      alert("Selecione um cliente e adicione pelo menos um item.");
      return;
    }

    try {
      await OrcamentoService.criarOrcamento({
        ...novoOrcamento,
        valorTotal,
      });
      const atualizados = await OrcamentoService.listarOrcamentos();
      setOrcamentos(atualizados || []);
      setIsModalOpen(false);
      resetNovoOrcamento();
      alert("Orçamento criado com sucesso!");
    } catch (error) {
      console.error(error);
      alert(
        `Erro ao criar orçamento: ${error.response?.data || error.message}`
      );
    }
  };

  const handleAprovarOrcamento = async (id) => {
    try {
      await OrcamentoService.aprovarOrcamento(id);
      const atualizados = await OrcamentoService.listarOrcamentos();
      setOrcamentos(atualizados || []);
    } catch {
      alert("Erro ao aprovar orçamento. Verifique se há estoque suficiente.");
    }
  };

  const handleCancelarOrcamento = async (id) => {
    try {
      await OrcamentoService.cancelarOrcamento(id);
      const atualizados = await OrcamentoService.listarOrcamentos();
      setOrcamentos(atualizados || []);
    } catch {
      alert("Erro ao cancelar orçamento.");
    }
  };

  const handleVisualizarOrcamento = async (id) => {
    try {
      const dados = await OrcamentoService.buscarPorId(id);

      const enrichedItens = dados.itens.map((item) => {
        const pecaDetalhes = pecas.find((p) => p.codPeca === item.codPeca);
        const estoqueDaPeca = estoque.find((e) => e.codPeca === item.codPeca);

        return {
          ...item,
          nomePeca: pecaDetalhes?.nome || item.nomePeca,
          modelo: pecaDetalhes?.modelo || "",
          montadora: pecaDetalhes?.montadora || "",
          ano: pecaDetalhes?.ano || "",
          descricao: pecaDetalhes?.descricao || "",

          estoqueAtual: estoqueDaPeca ? estoqueDaPeca.quantidade : 0,
        };
      });

      setOrcamentoSelecionado({ ...dados, itens: enrichedItens });
      setModalVisualizarAberto(true);
    } catch (error) {
      console.error("Erro ao buscar orçamento:", error);
      alert("Erro ao buscar orçamento.");
    }
  };

  // No seu Orcamentos.js, procure por esta função e substitua-a:
  const gerarPdf = (orcamento) => {
    const doc = new jsPDF();

    // Título do Documento
    doc.setFontSize(20);
    doc.text("Orçamento de Peças", 105, 20, null, null, "center");

    // Informações do Cliente e Orçamento
    doc.setFontSize(12);
    let yPos = 35;
    doc.text(`ID do Orçamento: ${orcamento.idOrcamento}`, 10, yPos);
    yPos += 7;
    doc.text(
      `Data: ${new Date(orcamento.dataOrcamento).toLocaleString()}`,
      10,
      yPos
    );
    yPos += 7;
    doc.text(`Status: ${orcamento.status}`, 10, yPos);
    yPos += 10; // Espaço extra antes das informações do cliente

    // Encontrar o nome completo do cliente
    const clienteDetalhes = clientes.find(
      (c) => c.cpf === orcamento.cpfCliente
    );
    const nomeCliente = clienteDetalhes
      ? clienteDetalhes.nome
      : orcamento.nomeCliente;

    doc.setFontSize(14);
    doc.text("Dados do Cliente:", 10, yPos);
    yPos += 7;
    doc.setFontSize(12);
    doc.text(`Nome: ${nomeCliente}`, 10, yPos);
    yPos += 7;
    doc.text(`CPF: ${orcamento.cpfCliente}`, 10, yPos);
    yPos += 15; // Espaço antes dos itens

    // Itens do Orçamento - Usando autoTable
    const headers = [
      ["Peça", "Montadora/Modelo", "Ano", "Qtd", "Preço Unit.", "Subtotal"],
    ];

    const data = orcamento.itens.map((item) => {
      // Garantir que os preços estejam formatados
      const precoUnit = `R$ ${item.precoUnitario.toFixed(2)}`;
      const subTotal = `R$ ${(item.quantidade * item.precoUnitario).toFixed(
        2
      )}`;
      const montadoraModelo = `${item.montadora || "-"} / ${
        item.modelo || "-"
      }`;

      return [
        item.nomePeca,
        montadoraModelo,
        item.ano || "-",
        item.quantidade,
        precoUnit,
        subTotal,
      ];
    });

    if (typeof doc.autoTable === "function") {
      doc.autoTable({
        startY: yPos, // Começa a tabela após as informações de cabeçalho
        head: headers,
        body: data,
        theme: "striped", // Pode ser 'striped', 'grid', 'plain'
        styles: {
          fontSize: 10,
          cellPadding: 2,
          halign: "center", // Alinhar texto do cabeçalho ao centro
        },
        headStyles: {
          fillColor: [30, 144, 255], // Cor azul para o cabeçalho (Dodger Blue)
          textColor: 255, // Texto branco
          fontStyle: "bold",
        },
        columnStyles: {
          0: { halign: "left" }, // Nome da peça alinhado à esquerda
          1: { halign: "left" }, // Montadora/Modelo alinhado à esquerda
          4: { halign: "right" }, // Preço Unit. alinhado à direita
          5: { halign: "right" }, // Subtotal alinhado à direita
        },
        didDrawPage: function (data) {
          // Footer (opcional)
          let str = "Página " + doc.internal.getNumberOfPages();
          doc.setFontSize(10);
          doc.text(
            str,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        },
      });
      yPos = doc.autoTable.previous.finalY + 10;
    }

    // Valor Total
    doc.setFontSize(14);
    doc.text(
      `Valor Total do Orçamento: R$ ${orcamento.valorTotal.toFixed(2)}`,
      10,
      yPos
    );
    yPos += 15;

    // Observações
    if (orcamento.observacoes) {
      doc.setFontSize(12);
      doc.text("Observações:", 10, yPos);
      yPos += 7;
      // Usar splitTextToSize para quebrar o texto se for muito longo
      const splitObservations = doc.splitTextToSize(orcamento.observacoes, 180); // 180mm largura
      doc.text(splitObservations, 10, yPos);
    }

    doc.save(`orcamento_${orcamento.idOrcamento}.pdf`);
  };

  const orcamentosFiltrados = orcamentos.filter((o) => {
    const termo = termoBusca.toLowerCase();
    return (
      o.idOrcamento.toString().includes(termo) ||
      o.nomeCliente?.toLowerCase().includes(termo) ||
      o.cpfCliente?.toLowerCase().includes(termo) ||
      new Date(o.dataOrcamento).toLocaleDateString().includes(termo)
    );
  });

  return (
    <div className="orcamentos-container">
      <h1>Gestão de Orçamentos</h1>
      <button className="add-btn" onClick={() => setIsModalOpen(true)}>
        ➕ Criar Orçamento
      </button>

      <input
        type="text"
        placeholder="Buscar por ID, nome, CPF, data..."
        value={termoBusca}
        onChange={(e) => setTermoBusca(e.target.value)}
        className="input-busca"
      />

      {/* Modal de Criação */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Novo Orçamento</h2>
        <div className="modal-form">
          <select
            value={novoOrcamento.cpfCliente}
            onChange={(e) =>
              setNovoOrcamento({ ...novoOrcamento, cpfCliente: e.target.value })
            }
          >
            <option value="">Selecione um cliente</option>
            {clientes.map(({ cpf, nome }) => (
              <option key={cpf} value={cpf}>
                {nome} - {cpf}
              </option>
            ))}
          </select>

          <hr />

          <div className="item-form">
            <select
              value={novoItem.codPeca}
              onChange={(e) => {
                const cod = parseInt(e.target.value) || 0;
                const peca = pecas.find((p) => p.codPeca === cod);
                setNovoItem({
                  ...novoItem,
                  codPeca: cod,
                  precoUnitario: peca ? peca.preco : 0,
                });
              }}
            >
              <option value="">Selecione uma peça</option>
              {pecas.map(
                ({
                  codPeca,
                  nome,
                  preco,
                  montadora,
                  modelo,
                  ano,
                  descricao,
                }) => (
                  <option key={codPeca} value={codPeca}>
                    {`${nome} - ${montadora} ${modelo} ${ano} - ${descricao} - R$ ${preco.toFixed(
                      2
                    )}`}
                  </option>
                )
              )}
            </select>

            <input
              type="number"
              min="1"
              value={novoItem.quantidade}
              onChange={(e) =>
                setNovoItem({
                  ...novoItem,
                  quantidade: parseInt(e.target.value) || 1,
                })
              }
            />
            <button onClick={adicionarItemAoOrcamento}>Adicionar Item</button>
          </div>

          <ul className="lista-itens">
            {novoOrcamento.itens.map((item, index) => {
              const peca = pecas.find((p) => p.codPeca === item.codPeca);
              return (
                <li key={index}>
                  {peca?.nome || "Peça"} {peca?.modelo || "Montadora"} - Ano:{" "}
                  {peca?.ano || "Ano"} - Qtde: {item.quantidade} - R${" "}
                  {(item.quantidade * item.precoUnitario).toFixed(2)}
                </li>
              );
            })}
          </ul>

          <textarea
            placeholder="Observações"
            value={novoOrcamento.observacoes}
            onChange={(e) =>
              setNovoOrcamento({
                ...novoOrcamento,
                observacoes: e.target.value,
              })
            }
          />

          <p>
            <strong>Valor Total:</strong> R$ {valorTotal.toFixed(2)}
          </p>
          <button onClick={handleSalvarOrcamento}>Salvar Orçamento</button>
        </div>
      </Modal>

      {/* Tabela de Orçamentos */}
      <table className="orcamentos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Data</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Observações</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {orcamentosFiltrados.map((orc) => (
            <tr key={orc.idOrcamento}>
              <td>{orc.idOrcamento}</td>
              <td>
                {orc.nomeCliente} ({orc.cpfCliente})
              </td>
              <td>{new Date(orc.dataOrcamento).toLocaleString()}</td>
              <td>R$ {orc.valorTotal.toFixed(2)}</td>
              <td>{orc.status}</td>
              <td>{orc.observacoes}</td>
              <td>
                <div className="orcamento-actions">
                  <button
                    className="action-btn btn-approve"
                    onClick={() => handleAprovarOrcamento(orc.idOrcamento)}
                    disabled={
                      orc.status === "APROVADO" || orc.status === "CANCELADO"
                    }
                    title="Aprovar orçamento"
                  >
                    ✅
                  </button>

                  <button
                    className="action-btn btn-cancel"
                    onClick={() => handleCancelarOrcamento(orc.idOrcamento)}
                    disabled={
                      orc.status === "APROVADO" || orc.status === "CANCELADO"
                    }
                    title="Cancelar orçamento"
                  >
                    ❌
                  </button>

                  <button
                    className="action-btn btn-view"
                    onClick={() => handleVisualizarOrcamento(orc.idOrcamento)}
                    title="Visualizar orçamento"
                  >
                    👁
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Visualização */}
      <Modal
        isOpen={modalVisualizarAberto}
        onClose={() => {
          setModalVisualizarAberto(false);
          setOrcamentoSelecionado(null);
        }}
        title="Visualizar Orçamento"
      >
        {orcamentoSelecionado && (
          <div className="orcamento-detalhes">
            <p>
              <strong>Cliente:</strong> {orcamentoSelecionado.nomeCliente} (
              {orcamentoSelecionado.cpfCliente})
            </p>
            <p>
              <strong>Data:</strong>{" "}
              {new Date(orcamentoSelecionado.dataOrcamento).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {orcamentoSelecionado.status}
            </p>
            <p>
              <strong>Observações:</strong>{" "}
              {orcamentoSelecionado.observacoes || "Nenhuma"}
            </p>

            <hr />
            {orcamentoSelecionado.status === "PENDENTE" &&
              orcamentoSelecionado.itens.some(
                (item) => item.quantidade > item.estoqueAtual
              ) && (
                <div className="item-alerta" style={{ marginBottom: "1rem" }}>
                  ⚠️ Atenção: Este orçamento possui itens com estoque
                  insuficiente.
                </div>
              )}

            <h4>Itens do Orçamento</h4>

            {orcamentoSelecionado.itens.map((item, i) => {
              const emFalta =
                orcamentoSelecionado.status === "PENDENTE" &&
                item.quantidade > item.estoqueAtual;

              return (
                <div
                  key={i}
                  className={`orcamento-item ${emFalta ? "falta" : ""}`}
                >
                  <p>
                    <strong>Nome:</strong> {item.nomePeca}
                  </p>
                  <p>
                    <strong>Modelo:</strong> {item.modelo || "-"}
                  </p>
                  <p>
                    <strong>Montadora:</strong> {item.montadora || "-"}
                  </p>
                  <p>
                    <strong>Ano:</strong> {item.ano || "-"}
                  </p>
                  <p>
                    <strong>Quantidade Solicitada:</strong> {item.quantidade}
                  </p>
                  <p>
                    <strong>Disponível em Estoque:</strong>{" "}
                    {item.estoqueAtual !== undefined &&
                    item.estoqueAtual !== null &&
                    item.estoqueAtual !== ""
                      ? item.estoqueAtual
                      : "N/A"}
                  </p>

                  {emFalta && (
                    <div className="item-alerta">
                      ❌ <strong>Estoque insuficiente:</strong> Essa peça está
                      em falta.
                    </div>
                  )}
                </div>
              );
            })}

            <p style={{ marginTop: "1rem" }}>
              <strong>Valor Total:</strong> R${" "}
              {orcamentoSelecionado.valorTotal.toFixed(2)}
            </p>

            <button onClick={() => gerarPdf(orcamentoSelecionado)}>
              📄 Exportar PDF
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orcamentos;
