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
      <nav className="sidebar-nav">
        {menuItems.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            className="sidebar-btn"
            type="button"
          >
            <span aria-label={label} role="img" style={{ marginRight: 8 }}>
              {icon}
            </span>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
