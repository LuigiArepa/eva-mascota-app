import { useEffect, useState, useCallback, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../servicios/api";
import BannerError from "../componentes/BannerError";
import { NotyfContext } from "../contexto/NotyfContext";
import { ArrowLeft, MessageSquare, Send, Trash2, Heart } from "lucide-react";
import "../styles/detalleMascota.css";

const TRADUCCIONES = {
  perdida: "Perdida",
  encontrada: "Encontrada",
  en_adopcion: "En adopción",
  adoptada: "Adoptada",
  perro: "Perro",
  gato: "Gato",
  ave: "Ave",
  roedor: "Roedor",
  reptil: "Reptil",
  otro: "Otro",
  macho: "Macho",
  hembra: "Hembra",
  desconocido: "Desconocido",
  pequeno: "Pequeño",
  mediano: "Mediano",
  grande: "Grande",
};

const DetalleMascota = () => {
  const { id } = useParams();
  const notyf = useContext(NotyfContext);
  const [mascota, setMascota] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState(null);
  const [esFavorito, setEsFavorito] = useState(false);
  const [autor, setAutor] = useState("");
  const [contenido, setContenido] = useState("");
  const [errorComentario, setErrorComentario] = useState(null);
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const verificarFavorito = useCallback((petId) => {
    try {
      const savedFavorites = localStorage.getItem("favorite_pets");

      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);

        if (Array.isArray(parsed)) {
          setEsFavorito(parsed.some((fav) => fav.id === petId));
        }
      }
    } catch (e) {}
  }, []);

  const obtenerDetalle = useCallback(async () => {
    setCargando(true);

    setErrorApi(null);

    try {
      const res = await api.get(`/mascotas/${id}/`);

      setMascota(res.data);

      verificarFavorito(res.data.id);
    } catch (err) {
      setErrorApi(err);
    } finally {
      setCargando(false);
    }
  }, [id, verificarFavorito]);

  useEffect(() => {
    obtenerDetalle();
  }, [id, obtenerDetalle]);

  const alternarFavorito = () => {
    if (!mascota) return;

    try {
      const savedFavorites = localStorage.getItem("favorite_pets");

      let currentFavs = [];

      if (savedFavorites) {
        currentFavs = JSON.parse(savedFavorites) || [];
      }

      const isAlreadyFav = currentFavs.some((fav) => fav.id === mascota.id);

      let updatedFavs;

      if (isAlreadyFav) {
        updatedFavs = currentFavs.filter((fav) => fav.id !== mascota.id);

        setEsFavorito(false);

        notyf.success("Eliminado de favoritos");
      } else {
        const cleanPet = {
          id: mascota.id,
          nombre: mascota.nombre,
          descripcion: mascota.descripcion || "",
          imagen: mascota.imagen,
          estado: mascota.estado,
          tipo_animal: mascota.tipo_animal || "otro",
          raza: mascota.raza || "",
          edad: mascota.edad || null,
          tamano: mascota.tamano || "desconocido",
          sexo: mascota.sexo || "desconocido",
          fecha_creacion: mascota.fecha_creacion,
          notes: "",
          rating: 5,
        };

        if (validarMascota(cleanPet)) {
          updatedFavs = [...currentFavs, cleanPet];

          setEsFavorito(true);

          notyf.success("Añadido a favoritos");
        } else {
          notyf.error("Error de seguridad al validar datos de favoritos.");

          return;
        }
      }

      localStorage.setItem("favorite_pets", JSON.stringify(updatedFavs));
    } catch (e) {}
  };

  const agregarComentario = async (e) => {
    e.preventDefault();

    if (!autor.trim() || !contenido.trim()) return;

    setErrorComentario(null);

    setEnviandoComentario(true);

    try {
      await api.post(`/mascotas/${id}/comentar/`, {
        autor: autor.trim(),

        contenido: contenido.trim(),
      });

      setAutor("");

      setContenido("");

      notyf.success("Comentario enviado correctamente");

      const res = await api.get(`/mascotas/${id}/`);

      setMascota(res.data);
    } catch (err) {
      setErrorComentario(err);
    } finally {
      setEnviandoComentario(false);
    }
  };

  const eliminarComentario = async (commentId) => {
    if (
      !window.confirm("¿Estás seguro de que deseas eliminar este comentario?")
    )
      return;

    setErrorComentario(null);

    try {
      await api.delete(`/comentarios/${commentId}/`);

      notyf.success("Comentario eliminado");

      const res = await api.get(`/mascotas/${id}/`);

      setMascota(res.data);
    } catch (err) {
      setErrorComentario(err);
    }
  };

  const t = (key) => TRADUCCIONES[key] || key || "No especificado";

  if (cargando) {
    return (
      <div className="contenedor-carga">
        <div className="spinner"></div>

        <p className="texto-cargando">Cargando detalles de la mascota...</p>
      </div>
    );
  }

  if (errorApi || !mascota) {
    return (
      <div>
        <div className="seccion-titulo">
          <Link to="/" className="boton boton-secundario">
            <ArrowLeft size={16} />
            Volver a la lista
          </Link>
        </div>

        <BannerError
          error={
            errorApi || {
              response: {
                status: 404,

                data: { detail: "No se pudo cargar la mascota." },
              },
            }
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="barra-superior-detalle">
        <Link
          to="/"
          className="boton boton-secundario"
          title="Volver al catálogo principal"
        >
          <ArrowLeft size={16} />
          Volver al listado
        </Link>

        <button
          onClick={alternarFavorito}
          className={`boton ${esFavorito ? "boton-peligro" : "boton-secundario"}`}
          title={esFavorito ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <Heart size={16} fill={esFavorito ? "#fff" : "none"} />

          {esFavorito ? "Quitar de Favoritos" : "Añadir a Favoritos"}
        </button>
      </div>

      {errorComentario && (
        <BannerError
          error={errorComentario}
          alCerrar={() => setErrorComentario(null)}
        />
      )}

      <div className="layout-detalle">
        <div className="contenedor-imagen-detalle">
          <img
            src={
              mascota.imagen ||
              "https://via.placeholder.com/600x450?text=Sin+Imagen"
            }
            alt={mascota.nombre}
            className="imagen-detalle"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/600x450?text=Error+Carga+Imagen";
            }}
          />
        </div>

        <div className="contenido-detalle">
          <div className="encabezado-detalle">
            <div className="titulo-detalle">
              <span>{mascota.nombre}</span>

              <span
                className={`etiqueta-estado status-${mascota.estado} badge-estatico`}
              >
                {t(mascota.estado)}
              </span>
            </div>

            <p className="fecha-registro">
              Registrada el{" "}
              {new Date(mascota.fecha_creacion).toLocaleDateString()}
            </p>
          </div>

          <p className="cita-descripcion">
            "{mascota.descripcion || "Sin descripción disponible."}"
          </p>

          <div className="grilla-detalle">
            <div className="item-detalle">
              <span className="etiqueta-item-detalle">Clase de Animal</span>

              <div className="valor-item-detalle">{t(mascota.tipo_animal)}</div>
            </div>

            <div className="item-detalle">
              <span className="etiqueta-item-detalle">Raza</span>

              <div className="valor-item-detalle">
                {mascota.raza || "Desconocida"}
              </div>
            </div>

            <div className="item-detalle">
              <span className="etiqueta-item-detalle">Sexo</span>

              <div className="valor-item-detalle">{t(mascota.sexo)}</div>
            </div>

            <div className="item-detalle">
              <span className="etiqueta-item-detalle">Tamaño</span>

              <div className="valor-item-detalle">{t(mascota.tamano)}</div>
            </div>

            <div className="item-detalle item-grid-completo">
              <span className="etiqueta-item-detalle">Edad estimada</span>

              <div className="valor-item-detalle">
                {mascota.edad !== null
                  ? `${mascota.edad} ${mascota.edad === 1 ? "año" : "años"}`
                  : "No registrada"}
              </div>
            </div>
          </div>

          <div className="seccion-comentarios">
            <h3 className="titulo-seccion-comentarios">
              <MessageSquare size={20} />
              Comentarios (
              {mascota.comentarios ? mascota.comentarios.length : 0})
            </h3>

            <div className="lista-comentarios">
              {!mascota.comentarios || mascota.comentarios.length === 0 ? (
                <p className="texto-sin-comentarios">
                  No hay comentarios aún. ¡Sé el primero en comentar!
                </p>
              ) : (
                mascota.comentarios.map((c) => (
                  <div key={c.id} className="item-comentario">
                    <div className="encabezado-comentario">
                      <span className="autor-comentario">{c.autor}</span>

                      <span className="fecha-comentario">
                        {new Date(c.fecha_creacion).toLocaleString()}
                      </span>
                    </div>

                    <p className="texto-comentario">{c.contenido}</p>

                    <button
                      onClick={() => eliminarComentario(c.id)}
                      className="boton-eliminar-comentario"
                      title="Eliminar este comentario"
                      aria-label="Eliminar comentario"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={agregarComentario}
              className="formulario-comentario"
            >
              <h4 className="titulo-formulario-comentario">Deja tu mensaje</h4>

              <div className="grupo-formulario grupo-formulario">
                <input
                  type="text"
                  className="input-formulario"
                  placeholder="Tu nombre (autor)..."
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  required
                  disabled={enviandoComentario}
                />
              </div>

              <div className="grupo-formulario grupo-formulario">
                <textarea
                  className="textarea-formulario textarea-comentario"
                  placeholder="Escribe tu comentario aquí..."
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                  required
                  disabled={enviandoComentario}
                />
              </div>

              <button
                type="submit"
                className="boton boton-primario boton-ancho-completo"
                disabled={
                  enviandoComentario || !autor.trim() || !contenido.trim()
                }
              >
                <Send size={14} />

                {enviandoComentario ? "Enviando..." : "Enviar Comentario"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleMascota;
