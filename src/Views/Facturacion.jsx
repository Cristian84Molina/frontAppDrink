import NavBarAdmin from "../Components/NavBarAdmin";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import '../index.css'

const Facturacion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rutaPpal = useSelector((state) => state.rutaReducer.rutaPrincipal);
  //cargamos el localstorage
  let localStorageJSON = localStorage.getItem("Carrito");
  let storedItems = [];
  if (localStorageJSON !== null) {
    storedItems = JSON.parse(localStorageJSON);
  }
  let suma = 0;
  storedItems.forEach((ele) => {
    suma += ele.precio;
  });
  const [arrayPagos, setArrayPagos] = useState([]);
  const [forpago, setForpago] = useState(1); //establecemos la forma de pago x defecto efectivo

  useEffect(() => {
    const fetchFpagos = async () => {
      try {
        const response = await axios.get(`${rutaPpal}formaspago`);
        setArrayPagos(response.data);
      } catch (error) {
        console.error("Error fetching lines:", error);
      }
    };
    fetchFpagos();
  }, []);

  const handleFormaPago = (e) => {
    e.preventDefault();
    const valor = e.target.value;
    setForpago(valor);
  };

  

  const handleGrabar = (e) => {
    e.preventDefault();
    const fecha = new Date(Date.now()).toLocaleDateString();
    const items = [];
    let bru = 0;
    storedItems.forEach((ele) => {
      const registro = {
        cantidad: ele.cantidad,
        preciocosto: ele.costo,
        impuesto: ele.impuesto,
        valorunitario: ele.precio,
        producto_id: ele.id,
      };
      bru += (ele.precio * ele.cantidad) / (1 + ele.impuesto / 100);
      items.push(registro);
    });
    const comanda = {
      fecha,
      bruto: suma,
      impuesto: suma - bru,
      neto: suma,
      cajero_id: 1,
      items,
      itemsPago: [
        {
          formapago_id: forpago,
          ctabancaria_id: 1,
          valor: suma,
        },
      ],
    };
    const grabar = async () => {
      try {
        const grabado = await axios.post(`${rutaPpal}comandas`, comanda);
        let storedItems = [];
        const updatedItemsJSON = JSON.stringify(storedItems);
        localStorage.setItem("Carrito", updatedItemsJSON);
        navigate("/home");
      } catch (error) {
        console.log("Error al intentar Grabar la comanda");
      }
    };
    grabar();
  };

  const consolidatedItems = [];

  // Consolidate items with the same id
  storedItems.forEach((ele) => {
    const existingItem = consolidatedItems.find((item) => item.id === ele.id);
    if (existingItem) {
      existingItem.cantidad += ele.cantidad;
      existingItem.precio += ele.precio;
    } else {
      consolidatedItems.push({ ...ele });
    }
  });
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: async () => {
      await handleGrabar(new Event("dummy"));
    },
    onAfterPrint: () => {
      // Puedes realizar acciones adicionales después de imprimir si es necesario
    },
  });

  const handleGuardarImprimir = async (e) => {
    e.preventDefault();
    await handlePrint();
  };

  const today = new Date();
  const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
  };

  const formattedDate = today.toLocaleDateString("es-ES", options);

  return (
    <div>
      <NavBarAdmin />

      <div className="grid grid-cols-2 gap-4 h-[80%]">
        {/* Bloque Ticket de Comandera */}
        <div
          className="col-span-1 bg-white rounded-[20px] m-4 flex flex-col justify-start max-w-[900px] h-[500px] shadow-md p-6 overflow-auto table-container"
          ref={componentRef}
        >
          <h1 className="text-2xl font-bold mb-4 ">Comanda</h1>
          <div>{formattedDate}</div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Detalle</th>
                <th className="py-2">Cantidad</th>
                <th className="py-2">Precio</th>
              </tr>
            </thead>
            <tbody>
              {consolidatedItems.map((ele) => (
                <tr key={ele.id} className="border-b">
                  <td key={ele.id} className="py-2">
                    {ele.name}
                  </td>
                  <td className="py-2">{ele.cantidad}</td>
                  <td className="py-2">{ele.precio}</td>
                </tr>
              ))}
              <tr>
                <td className="py-2 font-bold">Totales</td>
                <td className="py-2 font-bold">{storedItems.length}</td>
                <td className="py-2 font-bold">{suma}</td>
              </tr>
            </tbody>
          </table>
              <tr>Documento no valido como Factura</tr>
        </div>

        {/* Bloque Formas de Pago y Botones */}
        <div className="col-span-1 bg-white rounded-[20px] m-4 flex flex-col justify-center items-center">
          <h1 className="text-xl font-bold mb-3">Formas de Pago</h1>
          <select
            name="fpago"
            className="mb-3"
            onChange={(e) => handleFormaPago(e)}
          >
            {arrayPagos.map((ele) => (
              <option key={ele.id} value={ele.id}>
                {ele.name}
              </option>
            ))}
          </select>

          <button
            className="font-fredericka rounded-lg w-[40%] bg-green-400 px-2 mb-2 hover:bg-green-600 font-bold text-[20px] hover:scale-105 transition"
            onClick={handleGuardarImprimir}
          >
            Guardar / Imprimir
          </button>

          <button
            className="font-fredericka rounded-lg w-[40%] bg-red-400 px-2 hover:bg-red-600 font-bold text-[20px] hover:scale-105 transition"
            onClick={() => navigate("/home")}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Facturacion;
