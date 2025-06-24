import React, { useState, useEffect } from "react";
import ClienteService from "../services/clienteService";
import OrcamentoService from "../services/orcamentoService";
import PecaService from "../services/pecaService";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "./Dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    clientesCount: 0,
    pecasCount: 0,
    orcamentosRecentes: [],
    totalOrcamentos: 0,
    valorTotalMes: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientes, orcamentos, pecas] = await Promise.all([
          ClienteService.listarTodos(),
          OrcamentoService.listarOrcamentos(),
          PecaService.listarTodos(),
        ]);

        const hoje = new Date();
        const orcamentosMes = orcamentos.filter(orc =>
          new Date(orc.dataOrcamento).getMonth() === hoje.getMonth()
        );

        setDashboardData({
          clientesCount: clientes.length,
          pecasCount: pecas.length,
          orcamentosRecentes: orcamentos.slice(-5).reverse(),
          totalOrcamentos: orcamentos.length,
          valorTotalMes: orcamentosMes.reduce((total, orc) => total + orc.valorTotal, 0),
        });
      } catch (error) {
        console.error("Erro ao carregar dados do Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const donutChartData = {
    labels: ["Clientes", "Orçamentos", "Peças"],
    datasets: [
      {
        label: "Quantidade",
        data: [dashboardData.clientesCount, dashboardData.totalOrcamentos, dashboardData.pecasCount],
        backgroundColor: ["#21387b", "#ffed00", "#fbc02d"],
        hoverOffset: 30,
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  if (loading) return <div className="loading">Carregando dados...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">📊 Painel de Gestão</h1>
        <p className="dashboard-subtitle">Visão geral da operação</p>
      </div>

      <div className="dashboard-grid">
        {/* Cards de Métricas */}
        <div className="metrics-container">
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon">👥</div>
              <h3 className="metric-title">Clientes</h3>
            </div>
            <p className="metric-value">{dashboardData.clientesCount}</p>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon">📄</div>
              <h3 className="metric-title">Orçamentos</h3>
            </div>
            <p className="metric-value">{dashboardData.totalOrcamentos}</p>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon">💰</div>
              <h3 className="metric-title">Valor (Mês)</h3>
            </div>
            <p className="metric-value money">
              {dashboardData.valorTotalMes.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon">🔩</div>
              <h3 className="metric-title">Peças</h3>
            </div>
            <p className="metric-value">{dashboardData.pecasCount}</p>
          </div>
        </div>

        {/* Gráfico */}
        <div className="chart-row">
          <div className="chart-container">
            <div className="chart-header">
              <h3 className="chart-title">📊 Distribuição de Cadastros</h3>
            </div>
            <div className="chart-wrapper">
              <Doughnut
                data={donutChartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Tabela de Últimos Orçamentos */}
        <div className="recent-container">
          <div className="recent-header">
            <h3 className="recent-title">🆕 Últimos Orçamentos</h3>
          </div>
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.orcamentosRecentes.map(orc => (
                  <tr key={orc.idOrcamento}>
                    <td>{orc.idOrcamento}</td>
                    <td className="truncate">{orc.nomeCliente || orc.cpfCliente}</td>
                    <td>
                      {orc.valorTotal.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td>
                      <span className={`status-badge status-${orc.status.toLowerCase()}`}>
                        {orc.status}
                      </span>
                    </td>
                    <td>{new Date(orc.dataOrcamento).toLocaleDateString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
