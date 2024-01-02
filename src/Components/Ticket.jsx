import { useState } from "react";
import Modal from "react-modal";
import { useLocation, useNavigate } from "react-router";

function Ticket({
  selectedDrinks,
  conteo,
  total,
  eliminarTrago,
  borrarTodosLosTragos,
}) {
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
  const location = useLocation();
  const navigate = useNavigate();
  const formattedDate = today.toLocaleDateString("es-ES", options);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const confirmarBorrarTodos = () => {
    if (window.confirm("¿Estás seguro de borrar todos los tragos?")) {
      borrarTodosLosTragos();
    }
  };

  const confirmarEliminarTrago = (trago) => {
    eliminarTrago(trago);
  };

  const handleCobrarClick = () => {
    // Abre la ventana modal al hacer clic en "Cobrar"
    setModalIsOpen(true);
  };

  const imprimirEnComandera = () => {
    // Implementa la lógica específica para imprimir en la comandera

    // Cierra la ventana modal después de imprimir
    setModalIsOpen(false);
  };

  return (
    <>
      <div className="bg-white h-full rounded-[50px] p-3 m-4 flex flex-col justify-start max-w-[500px]">
        <h2 className="text-[50px] font-fredericka">Ticket</h2>
        <div>{formattedDate}</div>
        <div className="w-full flex items-center justify-center pt-3">
          <div className="w-[80%] flex items-center bg-gray-700 h-[2px]"></div>
        </div>
        <div className="text-xl flex flex-cols-7 justify-around h-[80%] overflow-y-scroll max-h-[220px]">
          <ul className="flex flex-col justify-start  mt-3 items-start col-span-3">
            {selectedDrinks.map((selectedDrink, index) => (
              <div className="flex flex-row gap-2" key={index}>
                <button
                  className="text-white text-sm bg-red-500 px-2 h-[25px] rounded-xl"
                  onClick={() => confirmarEliminarTrago(selectedDrink)}
                >
                  x
                </button>
                <li>{selectedDrink.name}</li>
              </div>
            ))}
          </ul>

          <ul className="flex flex-col justify-start   items-start col-span-3">
            {selectedDrinks.map((selectedDrink, index) => (
              <li key={index}>$ {selectedDrink.precio}</li>
            ))}
          </ul>
        </div>
        <div className="w-full flex items-center justify-center pt-3">
          <div className="w-[80%] flex items-center bg-gray-700 h-[2px] m-2"></div>
        </div>
        <div className="flex flex-col-2 justify-around text-xl font-bold w-full ">
          <div>Cantidad: {conteo}</div>
          <div>Total: {total}</div>
        </div>
        <div className="w-full flex items-center justify-center pt-3">
          <div className="w-[80%] flex items-center bg-gray-700 h-[2px] m-2"></div>
        </div>
        <div className=" flex justify-around">
          <button
            onClick={confirmarBorrarTodos}
            className="font-fredericka rounded-lg w-[40%] bg-red-500 px-2 hover:bg-red-600  font-bold text-[20px] hover:scale-105 transition"
          >
            Borrar todo
          </button>
          <button
            onClick={() => navigate("/facturar")}
            className="font-fredericka rounded-lg w-[40%] bg-sky-500 py-2 hover:bg-sky-600 hover:scale-105 transition font-bold text-[30px]"
          >
            Cobrar
          </button>
        </div>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 print:hidden">
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Comanda"
            className="w-72 print:w-full bg-gray-100 p-4 rounded-md shadow-xl border border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div>
              <h2 className="text-lg font-bold mb-2">Comanda</h2>

              <p className="mb-2">{formattedDate}</p>
              <div className="w-full flex items-center justify-center ">
                <div className="w-[100%] flex items-center bg-gray-700 h-[2px] "></div>
              </div>
              <ul>
                {selectedDrinks.map((selectedDrink, index) => (
                  <li key={index} className="mb-1">
                    {selectedDrink.name} - ${selectedDrink.precio}
                  </li>
                ))}
              </ul>
              <div className="w-full flex items-center justify-center ">
                <div className="w-[100%] flex items-center bg-gray-700 h-[2px] "></div>
              </div>
              <p className="mb-2">Cantidad: {conteo}</p>
              <div className="w-full flex items-center justify-center ">
                <div className="w-[100%] flex items-center bg-gray-700 h-[2px] "></div>
              </div>
              <p className="mb-2 text-center font-bold text-lg">
                Total: ${total}
              </p>
              <div className="flex justify-center items-center">
                <button
                  onClick={imprimirEnComandera}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Imprimir
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Ticket;
