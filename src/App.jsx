import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import BarraNavegacion from "./components/BarraNavegacion";
import ListaMascotas from "./pages/ListaMascotas";
import FormularioMascota from "./pages/FormularioMascota";
import Favoritos from "./pages/Favoritos";
import DetalleMascota from "./pages/DetalleMascota";

function App() {
  return (
    <Router>
      <div className="app-container">
        <BarraNavegacion />
        <main className="contenido-principal">
          <Routes>
            <Route path="/" element={<ListaMascotas />} />
            <Route path="/registrar" element={<FormularioMascota />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/mascotas/:id" element={<DetalleMascota />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
