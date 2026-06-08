import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function Carrito() {
  const [carrito, setCarrito] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = cargando
  const navigate = useNavigate();

  const fetchCarrito = async () => {
    try {
      const res = await api.get("/carrito");
      setCarrito(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Verificar si hay token al cargar el componente
    const token = localStorage.getItem("token");

    if (token && token !== "null" && token !== "undefined") {
      setIsAuthenticated(true);
      fetchCarrito();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const eliminarItem = async (id) => {
    try {
      await api.delete(`/carrito/item/${id}`);
      fetchCarrito();
    } catch (error) {
      console.log(error);
    }
  };

  const vaciarCarrito = async () => {
    try {
      await api.delete("/carrito/vaciar");
      setCarrito(null);
    } catch (error) {
      console.log(error);
    }
  };

  const realizarCompra = async () => {
    try {
      await api.post("/compra/checkout");
      fetchCarrito();
    } catch (error) {
      console.log(error);
    }
  };

  // ⭐ PRIMERO: si no está autenticado
  if (isAuthenticated === false) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Acceso para clientes</h2>
        <p className="text-gray-600">
          Debes estar registrado o iniciar sesión para ver tu carrito.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
        >
          Iniciar sesión
        </button>
      </div>
    );
  }

  // SEGUNDO: si está cargando la autenticación o el carrito
  if (isAuthenticated === null || !carrito) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Cargando carrito...
      </p>
    );
  }

  // Resto de tu componente igual
  return (
    <div className="max-w-4xl mx-auto p-6">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Tu carrito
      </h2>

      {carrito.items.length === 0 ? (
        <p className="text-center text-gray-500">
          El carrito está vacío
        </p>
      ) : (
        <div className="space-y-4">

          {carrito.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold text-lg">
                  {item.nombreProducto}
                </p>
                <div className="flex gap-4 text-sm text-gray-600 mt-1">
                  <span>Talla: {item.talla}</span>
                  <span>Cantidad: {item.cantidad}</span>
                </div>
              </div>

              <button
                onClick={() => eliminarItem(item.itemId)}
                className="text-black font-medium transition hover:text-red-600"
              >
                Eliminar
              </button>
            </div>
          ))}

          <div className="flex flex-col md:flex-row gap-3 pt-6">
            <button
              onClick={vaciarCarrito}
              className="w-full md:w-1/2 bg-gray-200 text-black py-3 rounded-md hover:bg-gray-300 transition"
            >
              Vaciar carrito
            </button>

            <button
              onClick={realizarCompra}
              className="w-full md:w-1/2 bg-black text-white py-3 rounded-md transition hover:bg-gray-500"
            >
              Realizar compra
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default Carrito;