import './App.css'
import {Routes,Route} from "react-router-dom"
import Login from './Views/Login'
import Admin from './Views/Admin'
import Home from "./Views/Home";
/* import AdminDrinks from './Views/AdminDrinks'; */
import AdminNewDrinks from './Views/AdminNewDrinks';
import Facturacion from './Views/Facturacion';
import Estadisticas from './Views/Estadisticas';
import EstadisticasFecha from './Components/EstadisticaFecha';
import EstadisticasDrinks from './Components/EstadisticaDrinks';
import CierreDia from './Views/CierreDia';




function App() {
 

  return (
    <Routes>
      <Route exact path='/' element={<Login />}/>
      
      <Route exact path="/home" element={<Home />} />
      <Route exact path="/admin/drinks" element={<Admin />} />
      <Route exact path='/admin/NewDrinks' element={<AdminNewDrinks />} />
      <Route exact path="/facturar" element={<Facturacion />} />
      <Route exact path="/admin/estadisticas" element={<Estadisticas />} />
      <Route exact path="/admin/estadisticas/fecha" element={<EstadisticasFecha />} />
      <Route exact path="/admin/estadisticas/drinks" element={<EstadisticasDrinks />} />
      <Route exact path="/cierre" element={<CierreDia />} />
    </Routes>
  )
}

export default App
