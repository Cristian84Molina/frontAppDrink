import { useState, useEffect } from "react";
import Ticket from "./Ticket";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useForm } from "react-hook-form";

function Drinks() {
  const rutaPpal = useSelector((state) => state.rutaReducer.rutaPrincipal);
  //cargamos el localstorage
  let localStorageJSON = localStorage.getItem("Carrito");
  let storedItems = [];
  if(localStorageJSON!==null) {
       storedItems = JSON.parse(localStorageJSON); 
  }
  let suma = 0;
  storedItems.forEach(ele => {suma+=ele.precio});

  const [originalDrinks, setOriginalDrinks] = useState([]); // Mantén una copia original de los productos
  const [drinks, setDrinks] = useState([]);
  const [selectedDrinks, setSelectedDrinks] = useState(storedItems);
  const [conteo, setConteo] = useState(storedItems.length);
  const [sumaPrecio, setSumaPrecios] = useState(suma);
  const [searchTerm, setSearchTerm] = useState("");
  const [lineas, setLineas] = useState([]);
  const [selectedLinea, setSelectedLinea] = useState("Todas las líneas");

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${rutaPpal}productos`);
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        const data = await response.json();
        console.log("Respuesta de la API de productos:", data);
  
        // Filtra los productos por la propiedad active antes de asignarlos
        const filteredDrinks = data.filter((drink) => drink.active === 1);
  
        setOriginalDrinks(filteredDrinks); // Actualiza la copia original de los productos
        setDrinks(filteredDrinks); // Inicialmente muestra solo productos activos
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductos();
  }, []);

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
  }, []);

  const handleLineaChange = (linea) => {
    console.log("Línea seleccionada:", linea);
  
    // Lógica para filtrar por línea
    const filteredDrinks = originalDrinks.filter(
      (drink) =>
        drink.linea_id == linea || linea === "Todas las líneas"
    );
  
    // Actualiza el estado solo cuando haya una selección
    setDrinks(filteredDrinks);
    setSelectedLinea(linea); // Agrega esta línea para mantener la pista de la línea seleccionada
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
    if(localStorageJSON!==null) {
       storedItems = JSON.parse(localStorageJSON); 
    }
    const array = storedItems.filter((ele)=> ele.registro !== trago.registro);
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
    selectedDrinks.forEach(ele =>{
       nreg = ele.registro;
    });
    nreg++;
    const newTrago = {registro: nreg,
                      id: trago.id,
                      name: trago.name,
                      impuesto: trago.impuesto,
                      precio: trago.precio,
                      costo: trago.costo}

    setSelectedDrinks((prevSelectedDrinks) => [...prevSelectedDrinks, newTrago]);
    setConteo((prev) => prev + 1);
    setSumaPrecios((prev) => prev + trago.precio);
    addLocalStorage(newTrago);
  }

  const addLocalStorage = (trago) => {
    let localStorageJSON = localStorage.getItem("Carrito");
    let storedItems = [];
    if(localStorageJSON!==null) {
       storedItems = JSON.parse(localStorageJSON); 
    }
    const nitem = {registro: trago.registro,
                   id: trago.id,
                   name: trago.name,
                   impuesto: trago.impuesto,
                   precio: trago.precio,
                   cantidad: 1,
                   costo: trago.costo}   
    storedItems.push(nitem);
    const updatedItemsJSON = JSON.stringify(storedItems);
    localStorage.setItem("Carrito", updatedItemsJSON);
    console.log(storedItems);
 };

  return (
    <div className="grid grid-cols-3 h-[80%]">
      <div className="col-span-2 bg-white h-[100%] rounded-[50px] m-4 flex flex-col justify-start max-w-[900px] overflow-hidden">
        <div className="w-full flex justify-around ml-9">
          <h2 className="text-[50px] font-fredericka">Drinks</h2>
          <div className="flex justify-sdt items-center">
            <input
              placeholder="Buscar trago"
              className="p-3 border border-1 border-gray-400 rounded-lg h-[50%]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            ></input>
            <select
              id="linea_id"
              {...register("linea_id", { required: true })}
              onChange={(e) => handleLineaChange(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value="Todas las líneas">Todas las líneas</option>
              {lineas.map((linea) => (
                <option key={linea.id} value={linea.id}>
                  {linea.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 overflow-y-auto">
          {drinks
            .filter((drink) => {
              const matchesLinea =
                selectedLinea === "Todas las líneas" || drink.linea_id == selectedLinea;
        
              const matchesSearchTerm = drink.name.toLowerCase().includes(searchTerm.toLowerCase());
        
              return matchesLinea && matchesSearchTerm;
            })
            .map((drink, index) => (
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
                  className="hover:bg-sky-300 p-2 shadow-md rounded-md flex"
                >
                  <div>
                    <img
                      className="mr-4 rounded-md h-16 w-16 object-cover"
                      src={drink.image}
                      alt={drink.name}
                    />
                  </div>

                  <div className="flex flex-col gap-2 items-start justify-center">
                    <h6 className="font-semibold">{drink.name}</h6>
                    {/* <h6 className="text-sm text-gray-700 text-left">
                      {drink.preparacion}
                    </h6> */}
                    <h6>${drink.precioventa}</h6>
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
