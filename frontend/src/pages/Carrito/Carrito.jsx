import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./Carrito.css"; // Importamos el CSS

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
      <div className="carrito-container">
        <div className="carrito-acceso">
          <h2 className="carrito-titulo">Acceso para clientes</h2>
          <p className="carrito-mensaje">
            Debes estar registrado o iniciar sesión para ver tu carrito.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="btn-iniciar-sesion"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  // SEGUNDO: si está cargando la autenticación o el carrito
  if (isAuthenticated === null || !carrito) {
    return (
      <div className="carrito-container">
        <div className="carrito-cargando">
          <div className="spinner"></div>
          <p className="cargando-texto">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h2 className="carrito-titulo-principal">
        Tu carrito
      </h2>

      {carrito.items?.length === 0 ? (
        <div className="carrito-vacio">
          <p className="vacio-texto">El carrito está vacío</p>
          <button
            onClick={() => navigate("/")}
            className="btn-ver-productos"
          >
            Ver productos
          </button>
        </div>
      ) : (
        <div className="carrito-items">
          {/* Lista de items del carrito */}
          {carrito.items.map((item) => (
            <div
              key={item.itemId}
              className="carrito-item"
            >
              <div className="item-info">
                <p className="item-nombre">
                  {item.nombreProducto}
                </p>
                <div className="item-detalles">
                  <span>Talla: {item.talla}</span>
                  <span>Cantidad: {item.cantidad}</span>
                  <span className="item-precio">
                    Precio: ${item.precio?.toFixed(2) || '0'}
                  </span>
                  <span className="item-subtotal">
                    Subtotal: ${((item.precio || 0) * item.cantidad).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => eliminarItem(item.itemId)}
                className="btn-eliminar"
              >
                Eliminar
              </button>
            </div>
          ))}

          {/* Total del carrito */}
          <div className="carrito-total">
            <div className="total-contenido">
              <span>Total:</span>
              <span>${carrito.total?.toFixed(2) || '0'}</span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="carrito-acciones">
            <button
              onClick={vaciarCarrito}
              className="btn-vaciar"
            >
              Vaciar carrito
            </button>

            <button
              onClick={realizarCompra}
              disabled={cargandoCompra}
              className={`btn-comprar ${cargandoCompra ? 'disabled' : ''}`}
            >
              {cargandoCompra ? (
                <span className="btn-contenido">
                  <span className="spinner-blanco"></span>
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