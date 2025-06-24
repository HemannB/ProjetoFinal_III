import React from "react";
import "./Sidebar.css";
import logo from "./logo.png";

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "clientes", label: "Clientes", icon: "👥" },
  { key: "orcamentos", label: "Orçamentos", icon: "📝" },
  { key: "estoque", label: "Estoque", icon: "📦" },
  { key: "pecas", label: "Peças", icon: "🔩" },
];

const Sidebar = ({ setPage }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Logo Procarro" />
      </div>
      <nav className="sidebar-nav" aria-label="Navegação principal">
        {menuItems.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            className="sidebar-btn"
            type="button"
          >
            <span className="sidebar-icon" aria-hidden="true">{icon}</span>
            <span className="sidebar-label">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;