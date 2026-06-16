import "./InicioSesion.css";
import arrow from "../../assets/images/arrow-left-circle.svg";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../../api/axios";

function InicioSesion() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  // =========================
  // SISTEMA DE NOTIFICACIONES
  // =========================
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState(null); // 'success', 'error', 'info'

  const mostrarMensaje = (texto, tipo = 'info') => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => {
      setMensaje(null);
      setTipoMensaje(null);
    }, 4000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      // LOGIN
      const response = await api.post("/login", formData);

      const token = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("isLogged", "true");

      // PERFIL
      const perfil = await api.get("/miPerfil", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const role = perfil.data.roles;

      localStorage.setItem("role", role);

      // REDIRECCIÓN
      navigate("/");

    } catch (error) {

      console.log(error);

      mostrarMensaje("Usuario o contraseña incorrectos", "error");
    }
  };

  return (

    <form className="formulario" onSubmit={handleLogin}>

      {/* ========================= */}
      {/* SISTEMA DE NOTIFICACIONES */}
      {/* ========================= */}
      {mensaje && (
        <div className={`mensaje-notificacion ${tipoMensaje}`}>
          {mensaje}
        </div>
      )}

      <div className="headerSesion">

        <p className="iniciarSesion">
          Iniciar Sesión
        </p>

        <Link className="volver" to="/">
          Volver
          <img src={arrow} alt="Volver" />
        </Link>

      </div>

      <input
        type="text"
        placeholder="Usuario"
        name="username"
        onChange={handleChange}
      />

      <input
        type="password"
        placeholder="Contraseña"
        name="password"
        onChange={handleChange}
      />

      <button type="submit" className="iniciar">
        Iniciar
      </button>

      <p className="noRegistrado">

        ¿No estás registrado?{" "}

        <Link to="/registro" className="registrateLink">
          Regístrate
        </Link>

      </p>

    </form>
  );
}

export default InicioSesion;