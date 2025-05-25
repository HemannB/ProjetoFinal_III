import React, { useState, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Orcamentos from "./pages/Orcamentos";
import Estoque from "./pages/Estoque";
import Pecas from "./pages/Pecas";
import "./styles/global.css";
import "./styles/transition.css";

const pages = {
  dashboard: Dashboard,
  clientes: Clientes,
  orcamentos: Orcamentos,
  estoque: Estoque,
  pecas: Pecas,
};

const App = () => {
  const [page, setPage] = useState("dashboard");
  const nodeRef = useRef(null); // ref para o CSSTransition

  const CurrentPage = pages[page];

  return (
    <div className="app-container">
      <Sidebar setPage={setPage} />
      <div className="main-content">
        <TransitionGroup component={null}>
          <CSSTransition
            key={page}
            timeout={400}
            classNames="fade"
            nodeRef={nodeRef} // <-- usa a ref aqui
          >
            <div className="page-wrapper" ref={nodeRef}>
              <CurrentPage />
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  );
};

export default App;
