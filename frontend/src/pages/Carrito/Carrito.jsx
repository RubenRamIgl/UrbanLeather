import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function Carrito() {
  const [carrito, setCarrito] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = cargando
  const [cargandoCompra, setCargandoCompra] = useState(false); // Estado para carga de compra
  const navigate = useNavigate();

  const fetchCarrito = async () => {
    try {
      const res = await api.get("/carrito");
      setCarrito(res.data);
    } catch (error) {
      console.log("Error al obtener carrito:", error);
      if (error.response?.status === 404) {
        setCarrito({ items: [], total: 0 });
      }
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
      fetchCarrito(); // Recargar carrito después de eliminar
    } catch (error) {
      console.log("Error al eliminar item:", error);
      alert("No se pudo eliminar el producto");
    }
  };

  const vaciarCarrito = async () => {
    if (window.confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      try {
        await api.delete("/carrito/vaciar");
        setCarrito({ items: [], total: 0 }); // Resetear carrito localmente
      } catch (error) {
        console.log("Error al vaciar carrito:", error);
        alert("No se pudo vaciar el carrito");
      }
    }
  };

  const realizarCompra = async () => {
    if (cargandoCompra) return; // Evitar doble clic

    setCargandoCompra(true);
    try {
      const response = await api.post("/compra/checkout");
      console.log("Compra realizada:", response.data);

      // Mostrar mensaje de éxito antes de redirigir
      alert("✅ ¡Compra realizada con éxito!");

      // Redirigir a la página de confirmación con los datos de la compra
      navigate("/compra/confirmacion", {
        state: { compra: response.data }
      });

    } catch (error) {
      console.error("Error al realizar la compra:", error);
      const mensaje = error.response?.data || "Error al procesar la compra";
      alert(mensaje);
      setCargandoCompra(false); // Solo resetear si hay error, si hay éxito redirige
    }
  };

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
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-2 text-gray-500">Cargando carrito...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Tu carrito
      </h2>

      {carrito.items?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">El carrito está vacío</p>
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Ver productos
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Lista de items del carrito */}
          {carrito.items.map((item) => (
            <div
              key={item.itemId}
              className="flex justify-between items-center border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex-1">
                <p className="font-semibold text-lg">
                  {item.nombreProducto}
                </p>
                <div className="flex gap-4 text-sm text-gray-600 mt-1">
                  <span>Talla: {item.talla}</span>
                  <span>Cantidad: {item.cantidad}</span>
                  <span className="font-medium text-black">
                    Precio: ${item.precio?.toFixed(2) || '0'}
                  </span>
                  <span className="font-medium text-gray-700">
                    Subtotal: ${((item.precio || 0) * item.cantidad).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => eliminarItem(item.itemId)}
                className="ml-4 text-black font-medium transition hover:text-red-600"
              >
                Eliminar
              </button>
            </div>
          ))}

          {/* Total del carrito */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>${carrito.total?.toFixed(2) || '0'}</span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col md:flex-row gap-3 pt-6">
            <button
              onClick={vaciarCarrito}
              className="w-full md:w-1/2 bg-gray-200 text-black py-3 rounded-md hover:bg-gray-300 transition font-medium"
            >
              Vaciar carrito
            </button>

            <button
              onClick={realizarCompra}
              disabled={cargandoCompra}
              className={`w-full md:w-1/2 bg-black text-white py-3 rounded-md transition font-medium ${
                cargandoCompra
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-800"
              }`}
            >
              {cargandoCompra ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Procesando...
                </span>
              ) : (
                "Realizar compra"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;