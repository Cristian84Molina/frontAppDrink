import { useState, useEffect } from "react";
import Ticket from "./Ticket";
import { useSelector } from "react-redux";
import axios from "axios";

function Drinks() {
  const rutaPpal = useSelector((state) => state.rutaReducer.rutaPrincipal);
  let localStorageJSON = localStorage.getItem("Carrito");
  let storedItems = [];
  if (localStorageJSON !== null) {
    storedItems = JSON.parse(localStorageJSON);
  }
  let suma = 0;
  storedItems.forEach((ele) => {
    suma += ele.precio;
  });

  const [originalDrinks, setOriginalDrinks] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [selectedDrinks, setSelectedDrinks] = useState(storedItems);
  const [conteo, setConteo] = useState(storedItems.length);
  const [sumaPrecio, setSumaPrecios] = useState(suma);
  const [lineas, setLineas] = useState([]);
  const [selectedLinea, setSelectedLinea] = useState("Todas las líneas");
  const [topProducts, setTopProducts] = useState([]);
  const [isTopProductsVisible, setIsTopProductsVisible] = useState(false);

  // Define a color map for the lines
  const colorMap = {
    "Todas las líneas": "bg-gray-200",
    1: "bg-red-200",
    2: "bg-green-200",
    3: "bg-blue-200",
    4: "bg-yellow-200",
    5: "bg-violet-200"
    // Add more colors for other lines as needed
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${rutaPpal}productos`);
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        const data = await response.json();
        console.log("Respuesta de la API de productos:", data);

        const filteredDrinks = data.filter((drink) => drink.active === 1);

        setOriginalDrinks(filteredDrinks);
        setDrinks(filteredDrinks);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductos();
  }, [rutaPpal]);

  useEffect(() => {
    const fetchLineas = async () => {
      try {
        const response = await axios.get(`${rutaPpal}lineas`);
        setLineas(response.data);
      } catch (error) {
        console.error("Error fetching lines:", error);
      }
    };

    fetchLineas();
  }, [rutaPpal]);

  const handleLineaChange = (linea) => {
    console.log("Línea seleccionada:", linea);

    const filteredDrinks = originalDrinks.filter(
      (drink) => drink.linea_id == linea || linea === "Todas las líneas"
    );

    setDrinks(filteredDrinks);
    setSelectedLinea(linea);
    setIsTopProductsVisible(false);
  };

  const fetchTopProducts = async () => {
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    const formattedStartDate = startDate.toISOString().split("T")[0];

    try {
      const url = `${rutaPpal}comandas?startDate=${formattedStartDate}&endDate=${endDate}`;
      const response = await fetch(url);
      const result = await response.json();

      // Agrupar productos y sumar cantidades
      const groupedProducts = result.reduce((acc, item) => {
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
      setIsTopProductsVisible(true);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  function eliminarTrago(trago) {
    const eliminarTragoSelec = selectedDrinks.filter(
      (selectedDrink) => selectedDrink !== trago
    );

    setSelectedDrinks(eliminarTragoSelec);
    setConteo((prevConteo) => prevConteo - 1);
    setSumaPrecios((prevSumaPrecios) => prevSumaPrecios - trago.precio);
    let localStorageJSON = localStorage.getItem("Carrito");
    let storedItems = [];
    if (localStorageJSON !== null) {
      storedItems = JSON.parse(localStorageJSON);
    }
    const array = storedItems.filter((ele) => ele.registro !== trago.registro);
    const updatedItemsJSON = JSON.stringify(array);
    localStorage.setItem("Carrito", updatedItemsJSON);
  }

  function borrarTodosLosTragos() {
    setSelectedDrinks([]);
    setConteo(0);
    setSumaPrecios(0);
    let storedItems = [];
    const updatedItemsJSON = JSON.stringify(storedItems);
    localStorage.setItem("Carrito", updatedItemsJSON);
  }

  function guardarTrago(trago) {
    let nreg = 0;
    selectedDrinks.forEach((ele) => {
      nreg = ele.registro;
    });
    nreg++;
    const newTrago = {
      registro: nreg,
      id: trago.id,
      name: trago.name,
      impuesto: trago.impuesto,
      precio: trago.precio,
      costo: trago.costo,
    };

    setSelectedDrinks((prevSelectedDrinks) => [
      ...prevSelectedDrinks,
      newTrago,
    ]);
    setConteo((prev) => prev + 1);
    setSumaPrecios((prev) => prev + trago.precio);
    addLocalStorage(newTrago);
  }

  const addLocalStorage = (trago) => {
    let localStorageJSON = localStorage.getItem("Carrito");
    let storedItems = [];
    if (localStorageJSON !== null) {
      storedItems = JSON.parse(localStorageJSON);
    }
    const nitem = {
      registro: trago.registro,
      id: trago.id,
      name: trago.name,
      impuesto: trago.impuesto,
      precio: trago.precio,
      cantidad: 1,
      costo: trago.costo,
    };
    storedItems.push(nitem);
    const updatedItemsJSON = JSON.stringify(storedItems);
    localStorage.setItem("Carrito", updatedItemsJSON);
    console.log(storedItems);
  };

  return (
    <div className="grid grid-cols-3 h-[80%]">
      <div className="col-span-2 bg-white h-[100%] rounded-[50px] m-4 flex flex-col justify-start max-w-[900px] overflow-hidden">
        <div className="w-full flex justify-around ml-9">
          <div className="flex flex-wrap justify-sdt items-center gap-2">
            <button
              onClick={() => handleLineaChange("Todas las líneas")}
              className={`p-2 border rounded-md ${
                selectedLinea === "Todas las líneas" ? "bg-sky-300" : ""
              }`}
            >
              Todas las líneas
            </button>
            {lineas.map((linea) => (
              <button
                key={linea.id}
                onClick={() => handleLineaChange(linea.id)}
                className={`p-2 border rounded-md ${
                  selectedLinea == linea.id ? colorMap[linea.id] : ""
                }`}
              >
                {linea.name}
              </button>
            ))}
            <button
              onClick={fetchTopProducts}
              className={`p-2 border rounded-md ${
                isTopProductsVisible ? "bg-sky-300" : ""
              }`}
            >
              Tragos Más Vendidos
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 overflow-y-auto">
          {isTopProductsVisible
            ? topProducts.map((product, index) => (
                <div key={index} className="m-3">
                  <button
                    onClick={() => {
                      guardarTrago({
                        registro: 0,
                        id: product.producto.id,
                        name: product.producto.name,
                        impuesto: product.producto.impuesto,
                        precio: product.producto.precioventa,
                        costo: product.producto.preciocosto,
                      });
                    }}
                    className={`hover:bg-sky-300 p-2 shadow-md rounded-md flex w-48 h-22 ${colorMap[product.producto.linea_id]}`}
                  >
                    <div className="flex flex-col gap-2 items-start justify-center w-full">
                      <h6 className="font-semibold text-lg truncate w-full">
                        {product.producto.name}
                      </h6>
                      <h6 className="self-center">
                        ${product.producto.precioventa}
                      </h6>
                    </div>
                  </button>
                </div>
              ))
            : drinks.map((drink, index) => (
                <div key={index} className="m-3">
                  <button
                    onClick={() => {
                      guardarTrago({
                        registro: 0,
                        id: drink.id,
                        name: drink.name,
                        impuesto: drink.impuesto,
                        precio: drink.precioventa,
                        costo: drink.preciocosto,
                      });
                    }}
                    className={`hover:bg-sky-300 p-2 shadow-md rounded-md flex w-48 h-22 ${colorMap[drink.linea_id]}`}
                  >
                    <div className="flex flex-col gap-2 items-start justify-center w-full">
                      <h6 className="font-semibold text-lg truncate w-full">
                        {drink.name}
                      </h6>
                      <h6 className="self-center">${drink.precioventa}</h6>
                    </div>
                  </button>
                </div>
              ))}
        </div>
      </div>
      <div className="col-span-1">
        <Ticket
          eliminarTrago={eliminarTrago}
          selectedDrinks={selectedDrinks}
          conteo={conteo}
          total={sumaPrecio}
          borrarTodosLosTragos={borrarTodosLosTragos}
        />
      </div>
    </div>
  );
}

export default Drinks;
