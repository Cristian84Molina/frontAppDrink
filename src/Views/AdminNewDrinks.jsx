import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import NavBarAdmin from "../Components/NavBarAdmin";
import SideBarAmin from "../Components/SidebarAdmin";
import axios from "axios";
import { useSelector } from "react-redux";


const AdminNewDrinks = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Agregamos la función reset
  } = useForm();

  const [lineas, setLineas] = useState([]);
  const [isDrinkSaved, setIsDrinkSaved] = useState(false);
  const rutaPpal = useSelector((state) => state.rutaReducer.rutaPrincipal);

  const handleAddNewDrink = async (data) => {
    try {
      const response = await axios.post(
        `${rutaPpal}productos`,
        data
      );
      console.log("Nuevo trago agregado:", response.data);

      // Mostrar la alerta de trago guardado exitosamente
      setIsDrinkSaved(true);

      // Limpiar los campos del formulario
      reset();

      // Puedes realizar acciones adicionales después de agregar el trago, si es necesario
    } catch (error) {
      console.error("Error adding new drink:", error);
      // Manejar errores aquí
    }
  };

  useEffect(() => {
    const fetchLineas = async () => {
      try {
        const response = await axios.get(`${rutaPpal}lineas`);
        setLineas(response.data);
      } catch (error) {
        console.error("Error fetching lines:", error);
        // Manejar errores aquí
      }
    };

    fetchLineas();
  }, []);

  return (
    <div>
      <div className="relative">
        <NavBarAdmin />
      </div>
      <div className="flex max-h-screen overflow-auto">
        <SideBarAmin />
        <div className="m-4 p-8 bg-white rounded shadow-md w-full">
          <h2 className="text-2xl font-semibold mb-4">Agregar Nuevo Trago</h2>
          <form
            onSubmit={handleSubmit(handleAddNewDrink)}
            encType="multipart/form-data"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Columna Izquierda */}
              <div>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name", { required: true })}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.name && (
                    <span className="text-red-500">
                      Este campo es requerido
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Imagen (URL)
                  </label>
                  <input
                    type="text"
                    id="image"
                    {...register("image", { required: true })}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.image && (
                    <span className="text-red-500">
                      Este campo es requerido
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="precioventa"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Precio Venta
                  </label>
                  <input
                    type="number"
                    id="precioventa"
                    {...register("precioventa", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.precioventa && (
                    <span className="text-red-500">
                      Este campo es requerido
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="active"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Activo
                  </label>
                  <select
                    id="active"
                    {...register("active", { required: true })}
                    className="mt-1 p-2 w-full border rounded-md"
                  >
                    <option value={1}>Sí</option>
                    <option value={0}>No</option>
                  </select>
                  {errors.active && (
                    <span className="text-red-500">
                      Este campo es requerido
                    </span>
                  )}
                </div>
              </div>

              {/* Columna Derecha */}
              <div>
                <div className="mb-4">
                  <label
                    htmlFor="preciocosto"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Precio Costo
                  </label>
                  <input
                    type="number"
                    id="preciocosto"
                    {...register("preciocosto", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.preciocosto && (
                    <span className="text-red-500">
                      Este campo es requerido
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="impuesto"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Impuesto
                  </label>
                  <input
                    type="number"
                    id="impuesto"
                    {...register("impuesto", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.impuesto && (
                    <span className="text-red-500">
                      Este campo es requerido
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="preparacion"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Preparación
                  </label>
                  <textarea
                    id="preparacion"
                    {...register("preparacion", { required: true })}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.preparacion && (
                    <span className="text-red-500">
                      Este campo es requerido
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="linea_id"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Línea
                  </label>
                  <select
                    id="linea_id"
                    {...register("linea_id", { required: true })}
                    className="mt-1 p-2 w-full border rounded-md"
                  >
                    {lineas.map((linea) => (
                      <option key={linea.id} value={linea.id}>
                        {linea.name}
                      </option>
                    ))}
                  </select>
                  {errors.linea_id && (
                    <span className="text-red-500">
                      Este campo es requerido
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Agregar Trago
              </button>
            </div>
          </form>
          {isDrinkSaved && (
            <div className="mt-4 p-2 bg-green-200 text-green-800 rounded-md">
              Trago guardado exitosamente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNewDrinks;
