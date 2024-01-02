import { useEffect, useState } from "react";
import axios from "axios";
import {useSelector} from "react-redux";

const CardDrink = () => {
  const [productos, setProductos] = useState([]);
  const rutaPpal = useSelector((state) => state.rutaReducer.rutaPrincipal);
  //const tragosSelected = useSelector((state) => state.rutaReducer.tragosSelected);

  useEffect(() => {
    // Llamada a la API para obtener productos
    axios
      .get(`${rutaPpal}productos`) // Asegúrate de cambiar la URL si es diferente
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="container mx-2 my-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="bg-white p-4 shadow-md rounded-md flex"
          >
            <img
              src={producto.image}
              alt={producto.name}
              className="mr-4 rounded-md h-16 w-16 object-cover"
            />
            <div>
              <p className="text-xl font-semibold mb-2">{producto.name}</p>
              <p className="text-gray-700">{producto.preparacion}</p>
              <p className="text-green-600 font-semibold mt-2">
                ${producto.precioventa}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardDrink;
