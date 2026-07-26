import { useEffect, useState, useContext } from "react";
import api from "../api/api";
import TarjetaMascota from "../components/TarjetaMascota";
import ModalEditarEstado from "../components/ModalEditarEstado";
import BannerError from "../components/BannerError";
import { NotyfContext } from "../contexto/NotyfContext";
import { validarMascota } from "../utils/validations";
import { Search, AlertCircle } from "lucide-react";
import "../styles/listarMascotas.css";

const ListaMascotas = () => {
  const notyf = useContext(NotyfContext);
  const [mascotas, setMascotas] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("");

  const obtenerMascotas = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await api.get("/mascotas/");
      setMascotas(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerMascotas();

    try {
      const savedFavorites = localStorage.getItem("favorite_pets");
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        if (Array.isArray(parsed)) {
          const validFavorites = parsed.filter(validarMascota);
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

  const alternarFavorito = (pet) => {
    try {
      const isAlreadyFav = favoritos.some((fav) => fav.id === pet.id);
      let updatedFavorites;

      if (isAlreadyFav) {
        updatedFavorites = favoritos.filter((fav) => fav.id !== pet.id);
        notyf.success("Eliminado de favoritos");
      } else {
        if (!validarMascota(pet)) {
          notyf.error(
            "Error de seguridad: Los datos de la mascota no son válidos para almacenamiento.",
          );
          return;
        }
        notyf.success("Añadido a favoritos");

        const cleanPet = {
          id: pet.id,
          nombre: pet.nombre.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
          descripcion: (pet.descripcion || "")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;"),
          imagen: pet.imagen,
          estado: pet.estado,
          tipo_animal: pet.tipo_animal || "otro",
          raza: pet.raza || "",
          edad: pet.edad || null,
          tamano: pet.tamano || "desconocido",
          sexo: pet.sexo || "desconocido",
          fecha_creacion: pet.fecha_creacion,
          notes: "",
          rating: 5,
        };

        updatedFavorites = [...favoritos, cleanPet];
      }

      setFavoritos(updatedFavorites);
      localStorage.setItem("favorite_pets", JSON.stringify(updatedFavorites));
    } catch (e) {}
  };

  const abrirEditarEstado = (id, currentStatus) => {
    setIdSeleccionado(id);
    setEstadoSeleccionado(currentStatus);
    setModalAbierto(true);
  };

  const guardarEstado = async (newStatus) => {
    setError(null);
    try {
      await api.patch(`/mascotas/${idSeleccionado}/`, { estado: newStatus });
      setModalAbierto(false);
      notyf.success("Estado actualizado correctamente");

      setMascotas((prevPets) =>
        prevPets.map((p) =>
          p.id === idSeleccionado ? { ...p, estado: newStatus } : p,
        ),
      );

      setFavoritos((prevFavs) => {
        const isFav = prevFavs.some((f) => f.id === idSeleccionado);
        if (isFav) {
          const updated = prevFavs.map((f) =>
            f.id === idSeleccionado ? { ...f, estado: newStatus } : f,
          );
          localStorage.setItem("favorite_pets", JSON.stringify(updated));
          return updated;
        }
        return prevFavs;
      });
    } catch (err) {
      setError(err);
    }
  };

  const eliminarMascota = async (id) => {
    setError(null);
    try {
      await api.delete(`/mascotas/${id}/`);
      notyf.success("Mascota eliminada correctamente");

      setMascotas((prevPets) => prevPets.filter((p) => p.id !== id));

      setFavoritos((prevFavs) => {
        const isFav = prevFavs.some((f) => f.id === id);
        if (isFav) {
          const updated = prevFavs.filter((f) => f.id !== id);
          localStorage.setItem("favorite_pets", JSON.stringify(updated));
          return updated;
        }
        return prevFavs;
      });
    } catch (err) {
      setError(err);
    }
  };

  const mascotasFiltradas = mascotas.filter((pet) => {
    const matchesSearch =
      pet.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (pet.descripcion &&
        pet.descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
      (pet.raza && pet.raza.toLowerCase().includes(busqueda.toLowerCase()));

    const matchesStatus = filtroEstado === "" || pet.estado === filtroEstado;
    const matchesType = filtroTipo === "" || pet.tipo_animal === filtroTipo;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div>
      <div className="seccion-titulo">
        <h2 className="titulo-pagina">Mascotas Registradas</h2>
        <p className="subtitulo-pagina">
          Explora la lista de mascotas reportadas, actualiza su estado o
          añádelas a tu lista local de favoritos.
        </p>
      </div>

      {error && <BannerError error={error} onClose={() => setError(null)} />}

      <div className="search-filter-container">
        <div className="contenedor-busqueda">
          <Search size={18} className="icono-busqueda" />
          <input
            type="text"
            className="form-input input-busqueda"
            placeholder="Buscar por nombre, descripción o raza..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div>
          <select
            className="form-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="">Todos los estados</option>
            <option value="perdida">Perdidas</option>
            <option value="encontrada">Encontradas</option>
            <option value="en_adopcion">En adopción</option>
            <option value="adoptada">Adoptadas</option>
          </select>
        </div>

        <div>
          <select
            className="form-select"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            aria-label="Filtrar por tipo de animal"
          >
            <option value="">Todos los animales</option>
            <option value="perro">Perros</option>
            <option value="gato">Gatos</option>
            <option value="ave">Aves</option>
            <option value="roedor">Roedores</option>
            <option value="reptil">Reptiles</option>
            <option value="otro">Otros</option>
          </select>
        </div>
      </div>

      {cargando ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p className="texto-cargando">Cargando listado de mascotas...</p>
        </div>
      ) : mascotasFiltradas.length === 0 ? (
        <div className="empty-state">
          <AlertCircle size={48} className="empty-state-icon" />
          <h3 className="empty-state-title">No se encontraron mascotas</h3>
          <p className="empty-state-desc">
            Prueba a cambiar los filtros o a realizar otra búsqueda.
          </p>
        </div>
      ) : (
        <div className="pet-grid">
          {mascotasFiltradas.map((pet) => (
            <TarjetaMascota
              key={pet.id}
              mascota={pet}
              esFavorito={favoritos.some((fav) => fav.id === pet.id)}
              alAlternarFavorito={alternarFavorito}
              alEditarEstado={abrirEditarEstado}
              alEliminar={eliminarMascota}
            />
          ))}
        </div>
      )}

      <ModalEditarEstado
        abierto={modalAbierto}
        estadoActual={estadoSeleccionado}
        alCerrar={() => setModalAbierto(false)}
        alGuardar={guardarEstado}
      />
    </div>
  );
};

export default ListaMascotas;
