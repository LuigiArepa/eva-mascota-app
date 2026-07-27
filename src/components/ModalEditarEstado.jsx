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
    <div className="superposicion-modal" onClick={alCerrar}>
      <div className="contenido-modal" onClick={(e) => e.stopPropagation()}>
        <div className="encabezado-modal">
          <h3 className="titulo-modal">Actualizar Estado</h3>
          <button
            onClick={alCerrar}
            className="boton-cerrar-modal"
            title="Cerrar modal"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={manejarEnvio}>
          <div className="grupo-formulario">
            <label className="etiqueta-formulario" htmlFor="selectorEstadoModal">
              Selecciona el nuevo estado:
            </label>
            <select
              id="selectorEstadoModal"
              className="selector-formulario"
              value={estadoSeleccionado}
              onChange={(e) => setEstadoSeleccionado(e.target.value)}
            >
              <option value="perdida">Perdida</option>
              <option value="encontrada">Encontrada</option>
              <option value="en_adopcion">En adopcion</option>
              <option value="adoptada">Adoptada</option>
            </select>
          </div>
          <div className="acciones-modal">
            <button
              type="button"
              className="boton boton-secundario"
              onClick={alCerrar}
            >
              Cancelar
            </button>
            <button type="submit" className="boton boton-primario">
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
