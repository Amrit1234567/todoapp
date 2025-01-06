const ToDoModal =({visible, onClose, children})=>{
    if (!visible) return null;

    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
}
export default ToDoModal;