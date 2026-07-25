import { useState } from "react";
import { X, Check } from "lucide-react";

const ModalEditarEstado = ({ abierto, estadoActual, alCerrar, alGuardar }) => {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(estadoActual);

  if (!abierto) return null;

  const manejarEnvio = (e) => {
    e.preventDefault();
    alGuardar(estadoSeleccionado);
  };

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="titulo-modal">Actualizar Estado</h3>
          <button
            onClick={alCerrar}
            className="theme-toggle-btn"
            title="Cerrar modal"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={manejarEnvio}>
          <div className="form-group">
            <label className="form-label" htmlFor="modalStatusSelect">
              Selecciona el nuevo estado:
            </label>
            <select
              id="modalStatusSelect"
              className="form-select"
              value={estadoSeleccionado}
              onChange={(e) => setEstadoSeleccionado(e.target.value)}
            >
              <option value="perdida">Perdida</option>
              <option value="encontrada">Encontrada</option>
              <option value="en_adopcion">En adopcion</option>
              <option value="adoptada">Adoptada</option>
            </select>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={alCerrar}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarEstado;
