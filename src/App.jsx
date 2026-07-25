import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ListaMascotas from "./page/ListaMascotas";

function App() {
  return (
    <Router>
      <div className="app-container">
        <BarraNavegacion />
        <main className="contenido-principal">
          <Routes>
            <Route path="/" element={<ListaMascotas />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
