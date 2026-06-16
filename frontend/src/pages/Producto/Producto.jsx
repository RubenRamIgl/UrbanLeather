import "./Producto.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Producto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [selectedTalla, setSelectedTalla] = useState(null);
  const [mensajeTalla, setMensajeTalla] = useState("");
  const [mensajeCarrito, setMensajeCarrito] = useState("");

  // =========================
  // SISTEMA DE NOTIFICACIONES
  // =========================
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState(null);

  const mostrarMensaje = (texto, tipo = 'info') => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => {
      setMensaje(null);
      setTipoMensaje(null);
    }, 4000);
  };

  // =========================
  // CARGAR PRODUCTO
  // =========================
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setCargando(true);

        // Verificar si hay token
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No hay token, cargando producto sin autenticación...");
          // Cargar producto sin autenticación
          const res = await api.get(`/productos/${id}`);
          setProducto(res.data);

          // seleccionar primera talla automáticamente
          if (res.data.tallas?.length > 0) {
            setSelectedTalla(res.data.tallas[0]);
          }

          setCargando(false);
          return;
        }

        // Con autenticación
        const res = await api.get(`/productos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setProducto(res.data);

        // seleccionar primera talla automáticamente
        if (res.data.tallas?.length > 0) {
          setSelectedTalla(res.data.tallas[0]);
        }

        setCargando(false);

      } catch (error) {
        console.log("Error cargando producto:", error);
        setCargando(false);

        // Si hay error de autenticación, intentar sin token
        try {
          const res = await api.get(`/productos/${id}`);
          setProducto(res.data);

          if (res.data.tallas?.length > 0) {
            setSelectedTalla(res.data.tallas[0]);
          }
        } catch (err) {
          console.log("Error cargando producto sin autenticación:", err);
          mostrarMensaje("Error al cargar el producto", "error");
        }
      }
    };

    fetchProducto();
  }, [id]);

  // =========================
  // AÑADIR AL CARRITO
  // =========================
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    // Si no está autenticado, redirigir al login (igual que el header)
    if (!token) {
      navigate("/login");
      return;
    }

    // Verificar que hay una talla seleccionada
    if (!selectedTalla) {
      mostrarMensaje("Por favor, selecciona una talla", "error");
      return;
    }

    try {
      await api.post("/carrito/item/add", null, {
        params: {
          productoId: producto.id,
          tallaId: selectedTalla.id,
          cantidad: 1
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      mostrarMensaje("Producto añadido al carrito", "success");

    } catch (error) {
      console.log("Error carrito:", error);

      if (error.response?.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem("token");
        localStorage.removeItem("isLogged");
        localStorage.removeItem("role");
        mostrarMensaje("Sesión expirada. Inicia sesión nuevamente.", "error");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        mostrarMensaje("Error al añadir al carrito", "error");
      }
    }
  };

  // Mostrar loading mientras carga
  if (cargando) {
    return (
      <div className="producto-container">
        <div className="loading-container">
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="producto-container">
        <div className="error-container">
          <p>Producto no encontrado</p>
          <button onClick={() => navigate("/")}>Volver al inicio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="producto-container">

      {/* ========================= */}
      {/* SISTEMA DE NOTIFICACIONES */}
      {/* ========================= */}
      {mensaje && (
        <div className={`mensaje-notificacion ${tipoMensaje}`}>
          {mensaje}
        </div>
      )}

      {/* IMAGEN */}
      <img
        src={producto.imagen_url}
        alt={producto.nombre}
        className="producto-img"
      />

      {/* INFO */}
      <div className="producto-info">

        <h2>{producto.nombre}</h2>
        <p className="descripcion">{producto.descripcion}</p>
        <p className="precio">{producto.precio}€</p>

        {/* =========================
            TALLAS
        ========================= */}
        <div className="tallas-container">

          <p className="tallas-label">Selecciona talla:</p>

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
                  talla-btn
                  ${selectedTalla?.id === t.id ? "active" : ""}
                  ${t.stock === 0 ? "disabled" : ""}
                `}
                disabled={t.stock === 0}
              >
                {t.nombre}
                {t.stock === 0 && <span className="sin-stock"> (sin stock)</span>}
              </button>
            ))}
          </div>

          {mensajeTalla && (
            <p className="mensaje-talla">
              {mensajeTalla}
            </p>
          )}

        </div>

        {/* BOTÓN AÑADIR AL CARRITO */}
        <button
          onClick={handleAddToCart}
          className="add-to-cart-btn"
        >
          Añadir al carrito
        </button>

        {/* Mostrar mensaje si no hay tallas */}
        {producto.tallas?.length === 0 && (
          <p className="sin-tallas">Este producto no tiene tallas disponibles</p>
        )}

      </div>
    </div>
  );
}

export default Producto;