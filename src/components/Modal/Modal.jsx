import "./Modal.css";

function Modal({ kicker, title, description, onClose, children }) {
    return (
        <div className="app-modal-backdrop" role="presentation" onMouseDown={onClose}>
            <section
                className="app-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="app-modal-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <header className="app-modal-header">
                    <div>
                        {kicker && <span className="app-modal-kicker">{kicker}</span>}
                        <h2 id="app-modal-title">{title}</h2>
                        {description && <p>{description}</p>}
                    </div>
                    <button className="app-modal-close" type="button" onClick={onClose} aria-label="Fechar">×</button>
                </header>
                <div className="app-modal-body">
                    {children}
                </div>
            </section>
        </div>
    );
}
 
export default Modal;