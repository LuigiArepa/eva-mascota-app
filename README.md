INTEGRANTES DEL PROYECTO MascotasApp:
Luis Jose Reyes Valles
Jorge Ramirez
Francisco Orellana


Este es el Front-End para la aplicación **MascotasApp**, desarrollado en React y empaquetado con Vite. Consume una API REST remota y gestiona un sistema de favoritos local persistente y seguro mediante Local Storage.

---

## 🚀 Características principales
- **Consumo completo de API REST**: Integración con Axios para operaciones GET, POST, PATCH y DELETE.
- **Formularios Dinámicos**: Carga automática de catálogos mediante `GET /api/choices/` en la creación de mascotas.
- **Carga de Archivos (Imágenes)**: Implementación de carga binaria utilizando `FormData` para enviar imágenes de mascotas.
- **Manejo Centralizado de Errores**: Componente `ErrorBanner` para formatear respuestas HTTP de error (400, 404, etc.) y fallos de conexión a mensajes comprensibles para el usuario final.
- **CRUD Local Storage (Favoritos)**:
  - **Create**: Guardar mascotas a favoritos con validación previa de esquema.
  - **Read**: Mostrar favoritos con notas personalizadas y estrellas de prioridad.
  - **Update**: Modificar notas y calificación de favoritos con saneamiento de entrada (contra XSS).
  - **Delete**: Eliminar mascotas de la lista local.
- **Ajuste de Diseño Simplificado**: Interfaz minimalista, limpia, responsiva y de colores planos, ideal para desarrolladores trainee.

---

## 🛠️ Instrucciones de Instalación y Ejecución

### Requisitos previos
- **Node.js** (v18 o superior)
- **NPM** (v9 o superior)

### Pasos para iniciar el proyecto localmente

1. Navega a la carpeta del proyecto:
   ```bash
   cd mascotas-front
   ```

2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo local:
   ```bash
   npm run dev
   ```

4. Abre tu navegador en la dirección indicada por la consola (típicamente `http://localhost:5173`).

5. Para correr el linter y verificar la calidad del código:
   ```bash
   npm run lint
   ```

---

## 🤖 Uso de Inteligencia Artificial (IA) en el Desarrollo

De acuerdo a las pautas de evaluación, se detalla a continuación el uso de herramientas de IA durante el desarrollo del proyecto:

1. **Estructura del Proyecto y Ruteo**: Se utilizó apoyo de IA para estructurar el árbol de componentes (separando vistas principales de componentes reutilizables como `PetCard`, `Navbar` y `ErrorBanner`) y configurar las rutas asíncronas de `react-router-dom`.
2. **Estrategia de Seguridad en Local Storage**: La IA sugirió implementar una función externa de validación de datos (`validatePetData` en `src/utils/validation.js`) para verificar que el contenido cargado del navegador no esté corrupto antes de procesarse, y sugirió el saneamiento con expresiones regulares para evitar ataques de inyección de código (Cross-Site Scripting - XSS) en los campos editables de notas personales.
3. **Manejo Dinámico de Errores**: La IA facilitó la creación del banner de error mapeando las respuestas complejas de validación de campos que devuelve Django REST Framework en errores HTTP 400.

---

## 📝 Respuestas a Preguntas Conceptuales

A continuación se responden los conceptos teóricos solicitados en la pauta de evaluación:

### 1. ¿Qué es destructuring y en qué situaciones lo utilizaron en el proyecto?
El **destructuring** (o desestructuración) es una característica de JavaScript (ES6) que permite extraer valores de arreglos u objetos y asignarlos a variables de forma rápida y limpia. 
- **En el proyecto lo utilizamos en**:
  - La desestructuración de props en componentes de React. Por ejemplo, en `PetCard`:
    ```javascript
    const PetCard = ({ pet, isFavorite, onToggleFavorite, onEditStatus, onDelete }) => { ... }
    ```
  - La extracción de propiedades específicas de un objeto. Por ejemplo, al extraer datos de una mascota:
    ```javascript
    const { id, nombre, descripcion, imagen, estado } = pet;
    ```
  - Al capturar parámetros de la URL usando hooks de react-router-dom:
    ```javascript
    const { id } = useParams();
    ```

### 2. ¿Qué hace async/await y qué problema resuelve frente al uso de .then()?
`async/await` es azúcar sintáctico sobre las Promesas en JavaScript. Permite escribir código asíncrono que se lee y se comporta de manera similar al código síncrono.
- **Problema que resuelve**: Elimina la necesidad de encadenar múltiples llamadas `.then()` y `.catch()`, lo cual puede derivar en un código difícil de leer y mantener (conocido históricamente como *Callback Hell* o *Promise Land*).
- **Ventajas**: 
  - Permite estructurar el flujo de control asíncrono de manera lineal.
  - Facilita el manejo de errores mediante bloques estándar `try/catch`, en lugar de requerir callbacks `.catch()` en cada paso de la promesa.

### 3. ¿Cómo funciona FormData y por qué es necesario para enviar la imagen de una mascota?
`FormData` es una interfaz nativa del navegador que permite compilar un conjunto de pares clave-valor para enviarlos mediante peticiones HTTP. Está diseñado principalmente para el envío de formularios de datos.
- **Por qué es necesario para imágenes**: Un JSON plano (`application/json`) solo acepta cadenas de texto, por lo que para enviar archivos binarios (como imágenes `.jpg` o `.png`) tendríamos que codificarlos en base64 (lo que aumenta el tamaño del archivo un 33% y requiere procesamiento extra). 
- **Funcionamiento**: `FormData` permite adjuntar archivos binarios reales directamente mediante `.append('imagen', imagenFile)`. Al enviar este objeto con Axios, el navegador establece automáticamente las cabeceras HTTP correctas como `Content-Type: multipart/form-data` y crea los límites (*boundaries*) necesarios para que el backend pueda descomponer y procesar el archivo correctamente.

### 4. ¿Qué son las props en React?
Las **props** (abreviatura de *properties*) son el mecanismo que utiliza React para pasar datos y configuraciones de un componente padre a un componente hijo.
- Son **unidireccionales** (fluyen únicamente de padre a hijo).
- Son **de solo lectura** (un componente hijo nunca debe modificar sus propias props directamente; si necesita notificar un cambio al padre, debe hacerlo llamando a funciones callback pasadas a través de las mismas props).

### 5. ¿Qué son los componentes en React?
Los **componentes** son los bloques de construcción fundamentales de una interfaz de usuario en React. Son piezas de código independientes, reutilizables y modulares.
- Pueden ser funciones de JavaScript que reciben *props* y retornan elementos JSX (estructura visual de la interfaz).
- Administran su propio estado local (`useState`) y tienen acceso a efectos secundarios y ciclo de vida (`useEffect`).

### 6. ¿Por qué no es una buena práctica mostrar al usuario final el mensaje de error tal como lo entrega la API?
Mostrar mensajes de error técnicos directos (como trazas de Django, nombres de tablas de bases de datos o excepciones de servidor) es una mala práctica por dos razones:
1. **Seguridad**: Exponer detalles del servidor como rutas internas, nombres de variables, versiones de software o consultas SQL puede ser aprovechado por atacantes para encontrar vulnerabilidades en el sistema.
2. **Experiencia de Usuario (UX)**: Los usuarios finales no comprenden términos como `"JSON parse error"` o `"No Mascota matches the given query."`. Mostrar estos mensajes genera desconfianza y frustración. Los errores deben traducirse a mensajes de lenguaje natural claros e instructivos (ej. *"La mascota seleccionada no existe o fue retirada"*).

### 7. ¿Qué diferencia existe entre PATCH y PUT, y por qué se utiliza PATCH para actualizar el estado de una mascota?
- **PUT**: Reemplaza el recurso de destino en su totalidad. Para usar PUT, debes enviar la representación completa del objeto con todos sus campos requeridos; si omites algún campo, este podría ser borrado o causar un error de validación en el servidor.
- **PATCH**: Aplica modificaciones parciales a un recurso. Solo requiere que envíes los campos específicos que deseas modificar.
- **Por qué se usa PATCH**: Para actualizar únicamente el estado de una mascota (ej. de 'perdida' a 'adoptada'), es ineficiente y riesgoso construir un formulario completo con la imagen binaria y todos los campos de texto usando PUT. En su lugar, mediante PATCH enviamos un simple objeto `{ estado: 'adoptada' }` al endpoint, haciendo que la actualización sea sumamente ligera y rápida.
