import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const CierreDia = () => {
  const obtenerFechaPorDefecto = () => {
    const fechaActual = new Date();
    const fechaInicio = new Date();
    const fechaFin = new Date();

    // Establecer la hora de inicio a las 18:00 del día anterior
    fechaInicio.setDate(fechaActual.getDate() - 1);
    fechaInicio.setHours(16, 0, 0, 0);

    // Establecer la hora de fin a las 11:00 del día actual
    fechaFin.setHours(8, 0, 0, 0);

    return {
      startDate: fechaInicio.toISOString().slice(0, 16), // Formato "YYYY-MM-DDTHH:mm"
      endDate: fechaFin.toISOString().slice(0, 16),
    };
  };

  const [dates, setDates] = useState(obtenerFechaPorDefecto());
  const [startDate, setStartDate] = useState(dates.startDate);
  const [endDate, setEndDate] = useState(dates.endDate);
  const [data, setData] = useState([]);
  const [totalBruto, setTotalBruto] = useState(0);
  const [totalsByPayment, setTotalsByPayment] = useState({});
  const rutaPpal = useSelector((state) => state.rutaReducer.rutaPrincipal);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${rutaPpal}comandas?startDate=${startDate}&endDate=${endDate}`;
        const response = await fetch(url);
        const result = await response.json();

        const filteredData = result.filter((item) => {
          const itemDate = new Date(item.fecha).toISOString().slice(0, 16);
          return itemDate >= startDate && itemDate <= endDate;
        });

        setData(filteredData);

        const totalBruto = filteredData.reduce((sum, item) => sum + item.bruto, 0);
        setTotalBruto(totalBruto);

        const totalsByPayment = filteredData.reduce((totals, item) => {
          const formaPago = item.detaformaspagos[0]?.formaspago?.name || "Sin especificar";
          totals[formaPago] = (totals[formaPago] || 0) + item.bruto;
          return totals;
        }, {});
        setTotalsByPayment(totalsByPayment);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  return (
    <div className="font-sans">
      <div className="m-4 p-8 bg-white rounded shadow-md w-full">
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">
            Selecciona el Rango de Fecha y Hora:
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>
                Inicio:
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </label>
            </div>
            <div>
              <label>
                Fin:
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="mb-6 border p-4 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-2">
            Totales por Forma de Pago:
          </h2>
          {Object.entries(totalsByPayment).map(([formaPago, total]) => (
            <p key={formaPago}>
              {formaPago}: ${total}
            </p>
          ))}
        </div>

        <div className="mb-6 border p-4 rounded shadow-md">
          <h2 className="text-4xl font-bold mb-2">
            Total Bruto: ${totalBruto}
          </h2>
        </div>

        <Link
          className="font-fredericka rounded-lg w-[40%] bg-green-400 px-2 mb-2 hover:bg-green-600 font-bold text-[20px] hover:scale-105 transition m-4"
          to="/"
        >
          Cerrar Turno
        </Link>

        <Link
          className="font-fredericka rounded-lg w-[40%] bg-red-400 px-2 hover:bg-red-600 font-bold text-[20px] hover:scale-105 transition"
          to="/home"
        >
          Volver
        </Link>

        <div className="mb-6 border p-4 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-2">
            Detalles de Forma de Pago por comandas:
          </h2>
          {data.map((item) => (
            <div key={item.id}>
              <p>Comanda: {item.numero}</p>
              <p>
                Forma de Pago:{" "}
                {item.detaformaspagos[0]?.formaspago?.name || "Sin especificar"}
              </p>
              <p>Valor: ${item.detaformaspagos[0]?.valor || 0}</p>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CierreDia;
