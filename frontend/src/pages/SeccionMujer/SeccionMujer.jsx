import "./SeccionMujer.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";

import heart from "../../assets/images/heart.svg";

function SeccionMujer() {

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // =========================
  // FILTRO URL
  // =========================
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilter(params.get("filter") || "");
  }, [location.search]);

  // =========================
  // CARGAR PRODUCTOS BACKEND
  // =========================
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setCargando(true);

        // Verificar si hay token
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No hay token, cargando productos sin autenticación...");
          // Intentar cargar productos sin autenticación
          const res = await api.get("/productos");
          const mujer = res.data.filter(
            (p) => p.categoriaNombre === "Mujer"
          );
          setProductos(mujer);
          setCargando(false);
          return;
        }

        // Con autenticación
        const res = await api.get("/productos", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const mujer = res.data.filter(
          (p) => p.categoriaNombre === "Mujer"
        );

        setProductos(mujer);
        setCargando(false);

      } catch (error) {
        console.log("Error cargando productos:", error);
        setCargando(false);

        // Si hay error de autenticación, intentar sin token
        try {
          const res = await api.get("/productos");
          const mujer = res.data.filter(
            (p) => p.categoriaNombre === "Mujer"
          );
          setProductos(mujer);
        } catch (err) {
          console.log("Error cargando productos sin autenticación:", err);
        }
      }
    };

    fetchProductos();
  }, []);

  // =========================
  // FILTRO EN TIEMPO REAL
  // =========================
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(filter.toLowerCase())
  );

  // Mostrar loading mientras carga
  if (cargando) {
    return (
      <div className="seccion-mujer">
        <div className="titulo">
          <p>MUJER</p>
        </div>
        <div className="loading-container">
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seccion-mujer">

      <div className="titulo">
        <p>MUJER</p>
      </div>

      <div className="chaquetas-container">

        {productosFiltrados.length === 0 ? (
          <p className="no-productos">No hay productos disponibles</p>
        ) : (
          productosFiltrados.map((item) => (
            <div
              className="chaqueta"
              key={item.id}
              onClick={() => navigate(`/producto/${item.id}`)}
              style={{ cursor: "pointer" }}
            >

              <img
                src={item.imagen_url}
                alt={item.nombre}
                className="chaqueta-img"
              />

              <div className="chaqueta-info">

                <p className="chaqueta-name">
                  {item.nombre}
                </p>

                <p className="chaqueta-price">
                  {item.precio}€
                </p>

                <img
                  src={heart}
                  alt="favorito"
                  className="chaqueta-heart"
                />

              </div>
            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default SeccionMujer;