import { NavLink } from 'react-router-dom';
import { PawPrint, PlusCircle, Heart } from 'lucide-react';

const BarraNavegacion = () => (
  <nav className="barra-navegacion">
    <NavLink to="/" className="marca-nav">
      <PawPrint size={32} />
      <span>MascotasApp</span>
    </NavLink>
    <div className="enlaces-nav">
      <NavLink to="/" className={({ isActive }) => "enlace-nav " + (isActive ? "activo" : "")} end>
        Mascotas
      </NavLink>
      <NavLink to="/registrar" className={({ isActive }) => "enlace-nav " + (isActive ? "activo" : "")}>
        <span className="enlace-icono">
          <PlusCircle size={16} />
          Registrar Mascota
        </span>
      </NavLink>
      <NavLink to="/favoritos" className={({ isActive }) => "enlace-nav " + (isActive ? "activo" : "")}>
        <span className="enlace-icono">
          <Heart size={16} />
          Favoritos
        </span>
      </NavLink>
    </div>
  </nav>
);


export default BarraNavegacion;
