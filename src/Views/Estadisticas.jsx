import { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import NavBarAdmin from "../Components/NavBarAdmin";
import SideBarAdmin from "../Components/SidebarAdmin";
import { useSelector } from "react-redux";

const Estadisticas = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartData, setChartData] = useState({});
  const rutaPpal = useSelector((state) => state.rutaReducer.rutaPrincipal);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${rutaPpal}comandas?startDate=${startDate}&endDate=${endDate}`;
        const response = await fetch(url);
        const result = await response.json();
        setData(result);

        // Agrupar datos por fecha y sumar los valores
        const groupedData = result.reduce((acc, item) => {
          const itemDate = new Date(item.fecha).toISOString().split("T")[0];
          acc[itemDate] = (acc[itemDate] || 0) + item.bruto;
          return acc;
        }, {});

        // Ordenar las fechas de menor a mayor
        const sortedDates = Object.keys(groupedData).sort(
          (a, b) => new Date(a) - new Date(b)
        );

        const chartValues = sortedDates.map((date) => groupedData[date]);

        setChartData({
          labels: sortedDates,
          datasets: [
            {
              label: "Ventas",
              data: chartValues,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 3,
            },
          ],
        });
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  useEffect(() => {
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        maintainAspectRatio: true,
        responsive: true,
        scales: {
          y: {
            beginAtZero: false,
            min: 0,
            // max: 100000, // No establezcas un máximo fijo
          },
        },
      },
    });

    // Limpia el gráfico anterior al desmontar el componente
    return () => {
      myChart.destroy();
    };
  }, [chartData]);

  return (
    <div className="font-sans">
      <div className="relative">
        <NavBarAdmin />
      </div>
      <div className="flex max-h-screen">
        <SideBarAdmin />
        <div className="m-4 p-2 bg-white rounded shadow-md w-full">
          {/* Gráfico de barras */}
          <div className="mb-6 border p-2 rounded shadow-md">
            <h1 className="text-lg font-bold">Ventas Totales</h1>
            <canvas id="myChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
