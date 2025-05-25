import React, { useState, useEffect } from "react";
import ClienteService from "../services/clienteService";
import OrcamentoService from "../services/orcamentoService";
import PecaService from "../services/pecaService";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "./Dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [clientesCount, setClientesCount] = useState(0);
  const [orcamentosRecentes, setOrcamentosRecentes] = useState([]);
  const [pecasCount, setPecasCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientes = await ClienteService.listarTodos();
        const orcamentos = await OrcamentoService.listarTodos();
        const pecas = await PecaService.listarTodas();

        setClientesCount(clientes.length);
        setOrcamentosRecentes(orcamentos.slice(-5));
        setPecasCount(pecas.length);
      } catch (error) {
        console.error("Erro ao carregar dados do Dashboard:", error);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: ["Clientes", "Orçamentos", "Peças"],
    datasets: [
      {
        label: "Quantidade",
        data: [clientesCount, orcamentosRecentes.length, pecasCount],
        backgroundColor: ["#21387b", "#ffed00", "#fbc02d"],
        hoverOffset: 30,
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 14, weight: "600" },
          color: "#21387b",
          padding: 20,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#21387b",
        titleColor: "#ffed00",
        bodyColor: "#fff",
        padding: 10,
        cornerRadius: 6,
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Painel da Procarro</h1>
      <p className="dashboard-subtitle">
        Acompanhe os principais indicadores da loja.
      </p>

      <div className="cards-container">
        <div className="card card-highlight">
          <h2>👥 Clientes</h2>
          <span>{clientesCount}</span>
        </div>
        <div className="card card-highlight">
          <h2>📄 Últimos Orçamentos</h2>
          <ul>
            {orcamentosRecentes.map((orc, index) => (
              <li key={index}>
                <strong>{orc.cpf_cliente}</strong> – R$ {orc.valor_total.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <div className="card card-highlight">
          <h2>🔩 Peças</h2>
          <span>{pecasCount}</span>
        </div>
      </div>

      <div className="chart-card">
        <h2>📈 Visão Geral</h2>
        <div className="chart-wrapper">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
