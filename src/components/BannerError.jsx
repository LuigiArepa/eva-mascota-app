import { AlertCircle } from "lucide-react";

const MENSAJES_ERROR = {
  400: {
    titulo: "Datos Invalidos (Error 400)",
    mensaje: "El servidor rechazo la solicitud. Verifica los datos ingresados.",
  },
  404: {
    titulo: "Recurso No Encontrado (Error 404)",
    mensaje: "La mascota o comentario no existe.",
  },
  405: {
    titulo: "Accion No Permitida (Error 405)",
    mensaje: "El metodo HTTP no esta permitido.",
  },
  415: {
    titulo: "Formato No Soportado (Error 415)",
    mensaje: "El tipo de contenido enviado es incompatible.",
  },
  500: {
    titulo: "Error Interno del Servidor (Error 500)",
    mensaje: "Problema inesperado en el servidor.",
  },
};

const BannerError = ({ error, alCerrar }) => {
  if (!error) return null;

  let titulo = "Ocurrio un error";
  let mensaje = "Intentelo de nuevo mas tarde.";
  let detalles = null;

  if (error.response) {
    const estado = error.response.status;
    const datos = error.response.data;
    const config = MENSAJES_ERROR[estado];
    if (config) {
      titulo = config.titulo;
      mensaje = config.mensaje;
    } else {
      titulo = "Error " + estado;
      mensaje = datos.detail || "Error al procesar la solicitud.";
    }
    if (estado === 400 && typeof datos === "object" && datos !== null) {
      if (datos.detail) {
        mensaje = datos.detail;
      } else {
        detalles = Object.entries(datos).map(([campo, msgs]) => ({
          campo: campo.charAt(0).toUpperCase() + campo.slice(1),
          mensaje: Array.isArray(msgs) ? msgs.join(" ") : String(msgs),
        }));
      }
    }
    if (estado === 404 && datos.detail) mensaje = datos.detail;
  } else if (error.request) {
    titulo = "Error de Conexion";
    mensaje = "No se recibio respuesta del servidor. Verifica tu conexion.";
  } else if (error.message) {
    titulo = "Error del Cliente";
    mensaje = error.message;
  }

  return (
    <div className="banner-error">
      <AlertCircle size={24} className="icono-error" />
      <div className="contenido-error">
        <h4 className="titulo-error">{titulo}</h4>
        <p className="mensaje-error">{mensaje}</p>
        {detalles && (
          <ul className="detalles-banner-error">
            {detalles.map((item, idx) => (
              <li key={idx}>
                <strong>{item.campo}:</strong> {item.mensaje}
              </li>
            ))}
          </ul>
        )}
      </div>
      {alCerrar && (
        <button
          onClick={alCerrar}
          className="boton-cerrar-error"
          title="Cerrar aviso"
        >
          &times;
        </button>
      )}
    </div>
  );
};


export default BannerError;
