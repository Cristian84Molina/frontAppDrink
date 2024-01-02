import { Link } from "react-router-dom";
import  { useState } from 'react';

const SideBarAmin = () => {
    const [mostrarLista, setMostrarLista] = useState(false);

  const toggleLista = () => {
    setMostrarLista(!mostrarLista);
  };
  return (
    <div className="bg-black w-64 h-screen border-t-4 border-white p-10">
      <ul>
      <li>
          <Link
            className="font-fredericka text-white text-2xl "
            to="/admin/drinks"
          >
            Drinks
          </Link>
        </li>
        <li>
          <Link
            className="font-fredericka text-white text-2xl "
            to="/admin/NewDrinks"
          >
            New Drinks
          </Link>
        </li>
        <li>
          <Link className="font-fredericka text-white text-2xl " to="/admin/estadisticas" onClick={toggleLista}>
            Estadisticas
          </Link>
          {mostrarLista && (
            <ul>
              <li>
                <Link className="font-fredericka text-white text-xl " to="/admin/estadisticas/drinks">. Drinks</Link>
              </li>
              
              <li>
                <Link className="font-fredericka text-white text-xl " to="/admin/estadisticas/fecha">. Fechas</Link>
              </li>
              
            </ul>
          )}
        </li>
        <br />
        <br />
        <Link className="bg-slate-200 font-fredericka text-lg text-black px-4 py-2 rounded" to="/">
  Salir
</Link>

      </ul>
    </div>
  );
};

export default SideBarAmin;
