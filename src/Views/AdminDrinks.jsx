/* import { useEffect, useState } from "react";
import NavBarAdmin from "../Components/NavBarAdmin";
import SideBarAmin from "../Components/SidebarAdmin";
import axios from "axios";
import ReactPaginate from "react-paginate";
import EditProduct from "../Components/EditProduct";

const AdminDrinks = () => {
  const [productos, setProductos] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const productosPerPage = 8;

  useEffect(() => {
    // Llamada a la API para obtener productos
    axios
      .get("http://localhost:3002/productos") 
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  

  const pageCount = Math.ceil(productos.length / productosPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  const [selectedProductId, setSelectedProductId] = useState(null);

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
        <SideBarAmin />

        <div className="m-2">
        <div className="m-4 flex justify-center">
            <ReactPaginate
              previousLabel={<span className="px-2">Anterior</span>}
              nextLabel={<span className="px-2">Siguiente</span>}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"pagination flex space-x-2"}
              previousLinkClassName={"border rounded px-3 py-2"}
              nextLinkClassName={"border rounded px-3 py-2"}
              disabledClassName={"pagination__link--disabled"}
              activeClassName={
                "pagination__link--active bg-blue-500 text-white"
              }
            />
          </div>
          <div className="border rounded  ">
            <table className="min-w-full divide-y divide-gray-200 relative">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    id
                  </th>
                  <th className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre Drink
                  </th>
                  <th className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingredientes
                  </th>
                  <th className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio de venta
                  </th>
                  <th className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accion
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-blue-200 ">
                {productos
                  .slice(
                    pageNumber * productosPerPage,
                    (pageNumber + 1) * productosPerPage
                  )
                  .map((producto) => (
                    <tr key={producto.id} className="h-12">
                      <td
                        className="px-3 py-4 "
                        
                      >
                        {producto.id}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap ">
                        {producto.name}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap ">
                        {producto.preparacion}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap ">
                        {producto.precioventa}
                      </td>
                      <td>
                        <button
                          onClick={() => handleModificar(producto.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          
        </div>
      </div>
      {selectedProductId && (
        <EditProduct
          productId={selectedProductId}
          onClose={handleCloseEdit}
          onUpdate={() => {
            // Actualizar la lista de productos después de la edición
            axios.get("http://localhost:3002/productos")
              .then((response) => {
                setProductos(response.data);
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

export default AdminDrinks;
 */