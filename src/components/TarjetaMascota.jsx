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
  const claseEstado = "estado-" + estado;
  const etiquetaEstado = ETIQUETAS_ESTADO[estado] || estado;

  return (
    <div className="tarjeta-mascota">
      <div className="contenedor-imagen-mascota">
        <img
          src={imagen || "https://via.placeholder.com/400x300?text=Sin+Imagen"}
          alt={nombre}
          className="imagen-mascota"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x300?text=Error+Carga+Imagen";
          }}
        />
        <span className={"etiqueta-estado " + claseEstado}>
          {etiquetaEstado}
        </span>
      </div>
      <div className="info-mascota">
        <div className="nombre-mascota">
          <span>{nombre}</span>
          <button
            className={"boton-favorito" + (esFavorito ? " activo" : "")}
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
        <div className="meta-mascota">
          {tipo_animal && (
            <span className="item-meta-mascota">
              {tipo_animal.charAt(0).toUpperCase() + tipo_animal.slice(1)}
            </span>
          )}
          {raza && <span className="item-meta-mascota">{raza}</span>}
          {edad !== null && edad !== undefined && (
            <span className="item-meta-mascota">
              {edad} {edad === 1 ? "ano" : "anos"}
            </span>
          )}
        </div>
        <p className="descripcion-mascota">
          {descripcion || "Sin descripcion disponible."}
        </p>
        <div className="acciones-mascota">
          <Link
            to={"/mascotas/" + id}
            className="boton boton-secundario boton-flexible"
            title="Ver informacion completa"
          >
            <Eye size={16} />
            Ver Detalle
          </Link>
          <button
            onClick={() => alEditarEstado(id, estado)}
            className="boton boton-primario boton-icono"
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
            className="boton boton-peligro boton-icono"
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
