import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import BannerError from "../components/BannerError";
import { NotyfContext } from "../context/NotyfContext";
import { Save, Image, RefreshCw } from "lucide-react";
import "../styles/formularioMascota.css";

const OPCIONES_FALLBACK = {
  estado: [
    { value: "perdida", label: "Perdida" },
    { value: "encontrada", label: "Encontrada" },
    { value: "en_adopcion", label: "En adopción" },
    { value: "adoptada", label: "Adoptada" },
  ],
  tipo_animal: [
    { value: "perro", label: "Perro" },
    { value: "gato", label: "Gato" },
    { value: "ave", label: "Ave" },
    { value: "roedor", label: "Roedor" },
    { value: "reptil", label: "Reptil" },
    { value: "otro", label: "Otro" },
  ],
  sexo: [
    { value: "macho", label: "Macho" },
    { value: "hembra", label: "Hembra" },
    { value: "desconocido", label: "Desconocido" },
  ],
  tamano: [
    { value: "pequeno", label: "Pequeño" },
    { value: "mediano", label: "Mediano" },
    { value: "grande", label: "Grande" },
    { value: "desconocido", label: "Desconocido" },
  ],
};

const FormularioMascota = () => {
  const navigate = useNavigate();
  const notyf = useContext(NotyfContext);

  const [opciones, setOpciones] = useState({
    estado: [],
    tipo_animal: [],
    sexo: [],
    tamano: [],
  });
  const [cargandoOpciones, setCargandoOpciones] = useState(true);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [estado, setEstado] = useState("perdida");
  const [tipoAnimal, setTipoAnimal] = useState("otro");
  const [edad, setEdad] = useState("");
  const [raza, setRaza] = useState("");
  const [sexo, setSexo] = useState("desconocido");
  const [tamano, setTamano] = useState("desconocido");

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerOpciones = async () => {
      setCargandoOpciones(true);
      try {
        const res = await api.get("/choices/");
        setOpciones(res.data);

        if (res.data.estado && res.data.estado.length > 0) {
          setEstado(res.data.estado[0].value);
        }
        if (res.data.tipo_animal && res.data.tipo_animal.length > 0) {
          setTipoAnimal(res.data.tipo_animal[0].value);
        }
        if (res.data.sexo && res.data.sexo.length > 0) {
          setSexo(res.data.sexo[0].value);
        }
        if (res.data.tamano && res.data.tamano.length > 0) {
          setTamano(res.data.tamano[0].value);
        }
      } catch (err) {
        setOpciones(OPCIONES_FALLBACK);
      } finally {
        setCargandoOpciones(false);
      }
    };

    obtenerOpciones();
  }, []);

  const cambiarArchivo = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImagen(e.target.files[0]);
    }
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    if (!nombre.trim()) {
      setError({
        response: {
          status: 400,
          data: { nombre: ["El nombre es requerido."] },
        },
      });
      setEnviando(false);
      return;
    }
    if (!descripcion.trim()) {
      setError({
        response: {
          status: 400,
          data: { descripcion: ["La descripción es requerida."] },
        },
      });
      setEnviando(false);
      return;
    }
    if (!imagen) {
      setError({
        response: {
          status: 400,
          data: { imagen: ["Debes seleccionar una imagen para la mascota."] },
        },
      });
      setEnviando(false);
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre.trim());
    formData.append("descripcion", descripcion.trim());
    formData.append("imagen", imagen);
    formData.append("estado", estado);
    formData.append("tipo_animal", tipoAnimal);
    formData.append("raza", raza.trim());
    formData.append("sexo", sexo);
    formData.append("tamano", tamano);

    if (edad !== "") {
      formData.append("edad", parseInt(edad, 10));
    }

    try {
      await api.post("/mascotas/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      notyf.success("Mascota registrada correctamente");
      navigate("/");
    } catch (err) {
      setError(err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="tarjeta-formulario">
      <div className="encabezado-formulario">
        <h2 className="titulo-formulario">Reportar Mascota</h2>
        <p className="subtitulo-formulario">
          Ingresa los datos del animal para guardarlo en la red de apoyo.
        </p>
      </div>

      {error && <BannerError error={error} alCerrar={() => setError(null)} />}

      {cargandoOpciones ? (
        <div className="contenedor-carga">
          <div className="spinner spinner-mediano"></div>
          <p className="texto-cargando">Cargando catálogos de opciones...</p>
        </div>
      ) : (
        <form onSubmit={enviarFormulario} noValidate>
          <div className="grupo-formulario">
            <label className="etiqueta-formulario" htmlFor="nombreInput">
              Nombre de la mascota <span className="texto-requerido">*</span>
            </label>
            <input
              id="nombreInput"
              type="text"
              className="input-formulario"
              placeholder="Ej: Firulais, Pelusa"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={enviando}
            />
          </div>

          <div className="fila-dos-columnas">
            <div className="grupo-formulario">
              <label className="etiqueta-formulario" htmlFor="tipoSelect">
                Tipo de animal
              </label>
              <select
                id="tipoSelect"
                className="select-formulario"
                value={tipoAnimal}
                onChange={(e) => setTipoAnimal(e.target.value)}
                disabled={enviando}
              >
                {opciones.tipo_animal.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grupo-formulario">
              <label className="etiqueta-formulario" htmlFor="razaInput">
                Raza
              </label>
              <input
                id="razaInput"
                type="text"
                className="input-formulario"
                placeholder="Ej: Mestizo, Golden"
                value={raza}
                onChange={(e) => setRaza(e.target.value)}
                disabled={enviando}
              />
            </div>
          </div>

          <div className="fila-dos-columnas">
            <div className="grupo-formulario">
              <label className="etiqueta-formulario" htmlFor="estadoSelect">
                Estado inicial
              </label>
              <select
                id="estadoSelect"
                className="select-formulario"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                disabled={enviando}
              >
                {opciones.estado.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grupo-formulario">
              <label className="etiqueta-formulario" htmlFor="edadInput">
                Edad estimada (años)
              </label>
              <input
                id="edadInput"
                type="number"
                min="0"
                className="input-formulario"
                placeholder="Ej: 2, 5 (opcional)"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                disabled={enviando}
              />
            </div>
          </div>

          <div className="fila-dos-columnas">
            <div className="grupo-formulario">
              <label className="etiqueta-formulario" htmlFor="sexoSelect">
                Sexo
              </label>
              <select
                id="sexoSelect"
                className="select-formulario"
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
                disabled={enviando}
              >
                {opciones.sexo.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grupo-formulario">
              <label className="etiqueta-formulario" htmlFor="tamanoSelect">
                Tamaño
              </label>
              <select
                id="tamanoSelect"
                className="select-formulario"
                value={tamano}
                onChange={(e) => setTamano(e.target.value)}
                disabled={enviando}
              >
                {opciones.tamano.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grupo-formulario">
            <label className="etiqueta-formulario" htmlFor="descTextarea">
              Descripción de la mascota{" "}
              <span className="texto-requerido">*</span>
            </label>
            <textarea
              id="descTextarea"
              className="textarea-formulario"
              placeholder="Describe su aspecto, temperamento o lugar donde fue vista..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              disabled={enviando}
            />
          </div>

          <div className="grupo-formulario">
            <label className="etiqueta-formulario" htmlFor="imagenFileInput">
              Fotografía <span className="texto-requerido">*</span>
            </label>
            <div className="fila-archivo">
              <label
                className="boton boton-secundario etiqueta-archivo"
                htmlFor="imagenFileInput"
              >
                <Image size={18} />
                Elegir foto
              </label>
              <input
                id="imagenFileInput"
                type="file"
                accept="image/*"
                onChange={cambiarArchivo}
                className="input-oculto"
                disabled={enviando}
              />
              <span className="nombre-archivo">
                {imagen ? imagen.name : "Ningún archivo seleccionado"}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="boton boton-primario boton-enviar"
            disabled={enviando}
          >
            {enviando ? (
              <>
                <RefreshCw size={18} className="icono-spin" />
                Registrando mascota...
              </>
            ) : (
              <>
                <Save size={18} />
                Guardar Mascota
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default FormularioMascota;
