import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./Carrito.css";

function Carrito() {
  const [carrito, setCarrito] = useState(null);

  const fetchCarrito = async () => {
    try {
      const res = await api.get("/carrito");
      setCarrito(res.data);
    } catch (error) {
      console.log("Error cargando carrito:", error);
    }
  };

  useEffect(() => {
    fetchCarrito();
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

  if (!carrito) return <p>Cargando carrito...</p>;

  return (
    <div className="carrito-container">

      <h2>Tu carrito</h2>

      {carrito.items.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          {carrito.items.map((item) => (
            <div className="carrito-item" key={item.id}>

              <div className="info">

                <p className="nombre">
                  {item.nombre}
                </p>

                <div className="detalle">
                  <span>Talla: {item.talla}</span>
                  <span>Cantidad: {item.cantidad}</span>
                </div>

              </div>

              <button onClick={() => eliminarItem(item.id)}>
                Eliminar
              </button>

            </div>
          ))}

          <button className="vaciar" onClick={vaciarCarrito}>
            Vaciar carrito
          </button>
        </>
      )}

    </div>
  );
}

export default Carrito;