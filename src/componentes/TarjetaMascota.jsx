import { Link } from "react-router-dom";

import { Eye, Edit3, Trash2, Heart } from "lucide-react";

const ETIQUETAS_ESTADO = {
  perdida: "Perdida",

  encontrada: "Encontrada",

  en_adopcion: "En Adopcion",

  adoptada: "Adoptada",
};

const TarjetaMascota = ({
  mascota,

  esFavorito,

  alAlternarFavorito,

  alEditarEstado,

  alEliminar,
}) => {
  const { id, nombre, descripcion, imagen, estado, tipo_animal, raza, edad } =
    mascota;

  const claseEstado = "status-" + estado;

  const etiquetaEstado = ETIQUETAS_ESTADO[estado] || estado;

  return (
    <div className="pet-card">
      <div className="pet-image-container">
        <img
          src={imagen || "https://via.placeholder.com/400x300?text=Sin+Imagen"}
          alt={nombre}
          className="pet-image"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x300?text=Error+Carga+Imagen";
          }}
        />

        <span className={"pet-badge-status " + claseEstado}>
          {etiquetaEstado}
        </span>
      </div>

      <div className="pet-info">
        <div className="pet-name">
          <span>{nombre}</span>

          <button
            className={"favorite-btn" + (esFavorito ? " active" : "")}
            onClick={(e) => {
              e.preventDefault();

              alAlternarFavorito(mascota);
            }}
            title={esFavorito ? "Quitar de favoritos" : "Anadir a favoritos"}
            aria-label="Marcar como favorito"
          >
            <Heart size={20} fill={esFavorito ? "#ff4757" : "none"} />
          </button>
        </div>

        <div className="pet-meta">
          {tipo_animal && (
            <span className="pet-meta-item">
              {tipo_animal.charAt(0).toUpperCase() + tipo_animal.slice(1)}
            </span>
          )}

          {raza && <span className="pet-meta-item">{raza}</span>}

          {edad !== null && edad !== undefined && (
            <span className="pet-meta-item">
              {edad} {edad === 1 ? "ano" : "anos"}
            </span>
          )}
        </div>

        <p className="pet-desc">
          {descripcion || "Sin descripcion disponible."}
        </p>

        <div className="pet-actions">
          <Link
            to={"/mascotas/" + id}
            className="btn btn-secondary flex-crecer"
            title="Ver informacion completa"
          >
            <Eye size={16} />
            Ver Detalle
          </Link>

          <button
            onClick={() => alEditarEstado(id, estado)}
            className="btn btn-primary btn-icon"
            title="Actualizar estado"
            aria-label="Editar estado"
          >
            <Edit3 size={16} />
          </button>

          <button
            onClick={() => {
              if (window.confirm("Estas seguro de eliminar a " + nombre + "?"))
                alEliminar(id);
            }}
            className="btn btn-danger btn-icon"
            title="Eliminar mascota"
            aria-label="Eliminar mascota"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TarjetaMascota;
