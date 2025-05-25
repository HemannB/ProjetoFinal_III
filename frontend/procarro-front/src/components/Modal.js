import React, { useEffect } from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, children, title }) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose} title="Fechar modal">×</button>
                {title && <h2 className="modal-title">{title}</h2>}
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
