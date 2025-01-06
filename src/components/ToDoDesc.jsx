const ToDoDesc=({visible, title, description, onClose})=>{
    if(!visible) return null;

    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>X</button>
                <p className="title">{title}</p>
                <p className="description">{description}</p>
            </div> 
        </div>
    );
}
export default ToDoDesc;