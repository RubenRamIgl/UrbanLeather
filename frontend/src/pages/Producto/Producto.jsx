import "./Producto.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Producto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [selectedTalla, setSelectedTalla] = useState(null);
  const [mensajeTalla, setMensajeTalla] = useState("");
  const [mensajeCarrito, setMensajeCarrito] = useState("");

  // =========================
  // CARGAR PRODUCTO
  // =========================
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await api.get(`/productos/${id}`);
        setProducto(res.data);

        // seleccionar primera talla automáticamente
        if (res.data.tallas?.length > 0) {
          setSelectedTalla(res.data.tallas[0]);
        }

      } catch (error) {
        console.log("Error cargando producto:", error);
      }
    };

    fetchProducto();
  }, [id]);

  // =========================
  // AÑADIR AL CARRITO
  // =========================
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setMensajeCarrito("Producto añadido al carrito");

    // ocultar mensaje después de 3 segundos
    setTimeout(() => {
      setMensajeCarrito("");
    }, 3000);

    try {
      await api.post("/carrito/item/add", null, {
        params: {
          productoId: producto.id,
          tallaId: selectedTalla.id,
          cantidad: 1
        }
      });

      alert("Producto añadido al carrito");

    } catch (error) {
      console.log("Error carrito:", error);
    }
  };

  if (!producto) return <p>Cargando...</p>;

  return (
    <div className="producto-container">

      {/* IMAGEN */}
      <img
        src={producto.imagen_url}
        alt={producto.nombre}
        className="producto-img"
      />

      {/* INFO */}
      <div className="producto-info">

        <h2>{producto.nombre}</h2>
        <p>{producto.descripcion}</p>
        <p className="precio">{producto.precio}€</p>

        {/* =========================
            TALLAS
        ========================= */}
        <div className="tallas-container">

          <p>Selecciona talla:</p>

          <div className="tallas">
            {producto.tallas?.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  if (t.stock === 0) return;
                  setSelectedTalla(t);
                  setMensajeTalla(`Talla seleccionada: ${t.nombre}`);
                }}
                className={`
                  ${selectedTalla?.id === t.id ? "active" : ""}
                  ${t.stock === 0 ? "disabled" : ""}
                `}
                disabled={t.stock === 0}
              >
                {t.nombre}
              </button>
            ))}
          </div>

          {mensajeTalla && (
            <p className="mensaje-talla">
              {mensajeTalla}
            </p>
          )}

        </div>

        {/* BOTÓN */}
        <button onClick={handleAddToCart}>
          Añadir al carrito
        </button>

      </div>
    </div>
  );
}

export default Producto;