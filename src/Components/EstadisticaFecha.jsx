import { useEffect, useState } from "react";
import SideBarAdmin from "./SidebarAdmin";
import NavBarAdmin from "./NavBarAdmin";
import { useSelector } from "react-redux";

const EstadisticasFecha = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const rutaPpal = useSelector((state) => state.rutaReducer.rutaPrincipal);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${rutaPpal}comandas?startDate=${startDate}&endDate=${endDate}`;
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.fecha).toISOString().split("T")[0];
    return startDate <= itemDate && itemDate <= endDate;
  });

  const totalBruto = filteredData.reduce((sum, item) => sum + item.bruto, 0);

  return (
    <div className="font-sans">
      <div className="relative">
        <NavBarAdmin />
      </div>
      <div className="flex max-h-screen">
        <SideBarAdmin />

        <div className="m-4 p-8 bg-white rounded shadow-md w-full">
          {/* Controles de filtrado */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Rango de Fechas:</h2>
            <div>
              <label className="mr-4">
                Inicio:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </label>
              <label>
                Fin:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Total Bruto */}
          <div className="mb-6 border p-4 rounded shadow-md">
            <h2 className="text-4xl font-bold mb-2">Total: ${totalBruto}</h2>
          </div>

          {/* Detalle */}
          <div className="border p-4 rounded shadow-md max-h-60 overflow-auto">
            <h2 className="text-lg font-bold mb-2 ">Detalle:</h2>
            <ul>
              {filteredData.map((item) => (
                <li
                  key={item.id}
                  className="mb-2 border-4 border-gray-300 pl-2 text-sm "
                >
                  Fecha: {new Date(item.fecha).toLocaleString()} - Bruto: ${" "}
                  {item.bruto}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasFecha;
