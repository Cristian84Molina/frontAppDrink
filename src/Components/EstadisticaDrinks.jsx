import { useEffect, useState } from "react";
import NavBarAdmin from "./NavBarAdmin";
import SideBarAdmin from "./SidebarAdmin";
import { useSelector } from "react-redux";

const EstadisticasDrinks = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [topProducts, setTopProducts] = useState([]);
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

  useEffect(() => {
    // Agrupar productos y sumar cantidades
    const groupedProducts = filteredData.reduce((acc, item) => {
      item.itemcomandas.forEach((product) => {
        const productId = product.producto_id;
        if (acc[productId]) {
          acc[productId].cantidad += product.cantidad;
        } else {
          acc[productId] = {
            producto: product.producto,
            cantidad: product.cantidad,
          };
        }
      });
      return acc;
    }, {});

    // Convertir el objeto en un array y ordenar por cantidad descendente
    const sortedProducts = Object.values(groupedProducts).sort(
      (a, b) => b.cantidad - a.cantidad
    );

    setTopProducts(sortedProducts);
  }, [filteredData]);

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

          {/* Mostrar lista de productos más vendidos */}
          <h2 className="text-2xl font-bold mb-4 text-black">
            Productos más vendidos:
          </h2>
          <div className="p-4 rounded-lg shadow-md max-w-md mx-auto overflow-y-auto max-h-96">
            <ul>
              {topProducts.map((product) => (
                <li
                  key={product.producto.id}
                  className="flex items-center mb-4"
                >
                  <img
                    src={product.producto.image}
                    alt={product.producto.name}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <span className="font-bold text-black">
                      {product.producto.name}:
                    </span>{" "}
                    <span className="text-black">
                      {product.cantidad} unidades
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasDrinks;
