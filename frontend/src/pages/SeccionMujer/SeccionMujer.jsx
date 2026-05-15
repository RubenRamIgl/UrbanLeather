import "./SeccionMujer.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";

import heart from "../../assets/images/heart.svg";

function SeccionMujer() {

  const [productos, setProductos] = useState([]);
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

        const res = await api.get("/productos");

        const mujer = res.data.filter(
          (p) => p.categoriaNombre === "Mujer"
        );

        setProductos(mujer);

      } catch (error) {
        console.log("Error cargando productos:", error);
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

  return (
    <div className="seccion-mujer">

      <div className="titulo">
        <p>MUJER</p>
      </div>

      <div className="chaquetas-container">

        {productosFiltrados.map((item) => (
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
        ))}

      </div>

    </div>
  );
}

export default SeccionMujer;