import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, Edit2, Check, Star, ArrowLeft } from "lucide-react";
import { NotyfContext } from "../contexto/NotyfContext";
import "../styles/favoritos.css";

const Favoritos = () => {
  const notyf = useContext(NotyfContext);
  const [favoritos, setFavoritos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [notaTemporal, setNotaTemporal] = useState("");

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("favorite_pets");
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        if (Array.isArray(parsed)) {
          setFavoritos(validFavorites);

          if (validFavorites.length !== parsed.length) {
            localStorage.setItem(
              "favorite_pets",
              JSON.stringify(validFavorites),
            );
          }
        }
      }
    } catch (e) {
      localStorage.setItem("favorite_pets", JSON.stringify([]));
    }
  }, []);

  const guardarNota = (id) => {
    try {
      const sanitizedNote = notaTemporal
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .trim();

      const updatedFavorites = favoritos.map((fav) => {
        if (fav.id === id) {
          return { ...fav, notes: sanitizedNote };
        }
        return fav;
      });

      setFavoritos(updatedFavorites);
      localStorage.setItem("favorite_pets", JSON.stringify(updatedFavorites));
      setEditandoId(null);
      setNotaTemporal("");
      notyf.success("Nota guardada");
    } catch (e) {}
  };

  const iniciarEdicion = (id, currentNote) => {
    setEditandoId(id);
    setNotaTemporal(currentNote || "");
  };

  const cambiarCalificacion = (id, newRating) => {
    try {
      const ratingVal = parseInt(newRating, 10);
      if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) return;

      const updatedFavorites = favoritos.map((fav) => {
        if (fav.id === id) {
          return { ...fav, rating: ratingVal };
        }
        return fav;
      });

      setFavoritos(updatedFavorites);
      localStorage.setItem("favorite_pets", JSON.stringify(updatedFavorites));
      notyf.success("Calificación actualizada");
    } catch (e) {}
  };

  const eliminarFavorito = (id) => {
    try {
      const updatedFavorites = favoritos.filter((fav) => fav.id !== id);
      setFavoritos(updatedFavorites);
      localStorage.setItem("favorite_pets", JSON.stringify(updatedFavorites));
      notyf.success("Eliminado de favoritos");
    } catch (e) {}
  };

  return (
    <div className="vista-favoritos">
      <div className="seccion-titulo-grande">
        <h2 className="titulo-con-icono">
          <Heart size={28} fill="currentColor" className="icono-corazon" />
          Mis Mascotas Favoritas
        </h2>
        <p className="subtitulo-pagina">
          Gestión offline y personalizada de tus mascotas guardadas. Las notas y
          calificaciones se guardan de manera segura en tu navegador (Local
          Storage CRUD).
        </p>
      </div>

      {favoritos.length === 0 ? (
        <div className="estado-vacio">
          <Heart size={48} className="icono-estado-vacio texto-discreto" />
          <h3 className="titulo-estado-vacio">
            Tu lista de favoritos está vacía
          </h3>
          <p className="desc-estado-vacio">
            Navega al catálogo de mascotas y presiona el ícono del corazón en
            cualquier tarjeta para guardarla aquí.
          </p>
          <Link to="/" className="boton boton-primario">
            <ArrowLeft size={16} />
            Ver catálogo de mascotas
          </Link>
        </div>
      ) : (
        <div className="grilla-mascotas">
          {favoritos.map((fav) => (
            <div key={fav.id} className="tarjeta-mascota">
              <div className="contenedor-imagen-mascota">
                <img
                  src={
                    fav.imagen ||
                    "https://via.placeholder.com/400x300?text=Sin+Imagen"
                  }
                  alt={fav.nombre}
                  className="imagen-mascota"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=Error+Imagen";
                  }}
                />
                <span className={`etiqueta-estado status-${fav.estado}`}>
                  {fav.estado.charAt(0).toUpperCase() +
                    fav.estado.slice(1).replace("_", " ")}
                </span>
              </div>

              <div className="info-mascota">
                <div className="nombre-mascota">
                  <span>{fav.nombre}</span>

                  <div className="contenedor-calificacion">
                    <Star size={16} fill="#fbbf24" className="icono-estrella" />
                    <select
                      value={fav.rating || 5}
                      onChange={(e) =>
                        cambiarCalificacion(fav.id, e.target.value)
                      }
                      className="selector-calificacion"
                      title="Calificar prioridad de seguimiento"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                </div>

                <div className="meta-mascota meta-con-margen">
                  <span className="item-meta-mascota">{fav.tipo_animal}</span>
                  {fav.raza && (
                    <span className="item-meta-mascota">{fav.raza}</span>
                  )}
                </div>

                <div className="area-notas-fav">
                  <div className="titulo-notas-fav">
                    <span>Notas de Seguimiento:</span>
                    {editandoId === fav.id ? (
                      <button
                        onClick={() => guardarNota(fav.id)}
                        className="btn-icono-success"
                        title="Guardar cambios"
                      >
                        <Check size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => iniciarEdicion(fav.id, fav.notes)}
                        className="btn-icono-primary"
                        title="Editar notas"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                  </div>

                  {editandoId === fav.id ? (
                    <textarea
                      className="textarea-formulario textarea-nota"
                      value={notaTemporal}
                      onChange={(e) => setNotaTemporal(e.target.value)}
                      placeholder="Escribe recordatorios o información de contacto..."
                    />
                  ) : (
                    <p
                      className={
                        fav.notes ? "texto-nota-normal" : "texto-nota-italica"
                      }
                    >
                      {fav.notes || "No has añadido notas de seguimiento."}
                    </p>
                  )}
                </div>

                <div className="acciones-mascota acciones-con-margen">
                  <Link
                    to={`/mascotas/${fav.id}`}
                    className="boton boton-secundario flex-crecer"
                  >
                    Detalle API
                  </Link>

                  <button
                    onClick={() => eliminarFavorito(fav.id)}
                    className="boton boton-peligro boton-icono"
                    title="Eliminar de tus favoritos locales"
                    aria-label="Quitar de favoritos"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favoritos;
