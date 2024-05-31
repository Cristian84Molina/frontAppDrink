import { useState, useEffect } from "react";
import axios from "axios";
import NavBarAdmin from "../Components/NavBarAdmin";
import SideBarAdmin from "../Components/SidebarAdmin";
import EditProduct from "../Components/EditProduct";
import { useSelector } from "react-redux";

const Admin = () => {
  const [productos, setProductos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);
  const rutaPpal = useSelector((state) => state.rutaReducer.rutaPrincipal);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productos.slice(indexOfFirstProduct, indexOfLastProduct);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const colorMap = {
    1: "bg-red-200",
    2: "bg-green-200",
    3: "bg-blue-200",
    4: "bg-yellow-200",
    5: "bg-violet-200"
    // Añadir más colores según sea necesario
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${rutaPpal}productos`);
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        const data = await response.json();
        // Ordenar los productos alfabéticamente por nombre
        const sortedProducts = data.sort((a, b) =>
          a.name.localeCompare(b.name, "en", { numeric: true })
        );
        setProductos(sortedProducts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductos();
  }, [rutaPpal]);

  const handleModificar = (id) => {
    console.log("ID seleccionado en handleModificar:", id);
    setSelectedProductId(id);
  };

  const handleCloseEdit = () => {
    setSelectedProductId(null);
  };

  return (
    <div>
      <div className="relative">
        <NavBarAdmin />
      </div>
      <div className="flex max-h-screen overflow-auto">
        <SideBarAdmin />

        <div className="container mx-2 my-2">
          {/* Paginación */}
          <div className="m-4">
            {Array.from(
              { length: Math.ceil(productos.length / productsPerPage) },
              (_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`mr-2 px-3 py-1 rounded-md ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentProducts.map((producto) => (
              <div
                key={producto.id}
                className={`p-4 shadow-md rounded-md flex flex-col w-48 h-32 ${colorMap[producto.linea_id]}`}
              >
                <div className="flex-1 overflow-hidden">
                  <a
                    href="#"
                    className={`text-xl font-semibold mb-2 hover:underline block truncate ${
                      producto.active === 0 ? "text-red-500" : "text-blue-500"
                    }`}
                    onClick={() => handleModificar(producto.id)}
                  >
                    {producto.name}
                  </a>
                  <p className="text-gray-700 truncate">
                    {producto.preparacion}
                  </p>
                </div>
                <p className="text-green-600 font-semibold mt-2">
                  ${producto.precioventa}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedProductId && (
        <EditProduct
          productId={selectedProductId}
          onClose={handleCloseEdit}
          onUpdate={() => {
            // Actualizar la lista de productos después de la edición
            axios
              .get(`${rutaPpal}productos`)
              .then((response) => {
                // Ordenar los productos alfabéticamente por nombre después de la actualización
                const sortedProducts = response.data.sort((a, b) =>
                  a.name.localeCompare(b.name, "en", { numeric: true })
                );
                setProductos(sortedProducts);
              })
              .catch((error) => {
                console.error("Error fetching data:", error);
              });
          }}
        />
      )}
    </div>
  );
};

export default Admin;
