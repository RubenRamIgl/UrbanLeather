import "./Registro.css";
import arrow from "../../assets/images/arrow-left-circle.svg";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../../api/axios";

function Registro() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    username: "",
    password: "",
    repetirPassword: "",
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {

      const response = await api.post("/register", formData);

      mostrarMensaje(response.data, "success");

      // Esperar 1.5 segundos para que se vea la notificación antes de redirigir
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {

      console.log(error);

      if (error.response) {
        mostrarMensaje(error.response.data.message, "error");
      } else {
        mostrarMensaje("Error al conectar con el servidor", "error");
      }
    }
  };

  return (
    <form className="formulario" onSubmit={handleRegister}>

      {/* ========================= */}
      {/* SISTEMA DE NOTIFICACIONES */}
      {/* ========================= */}
      {mensaje && (
        <div className={`mensaje-notificacion ${tipoMensaje}`}>
          {mensaje}
        </div>
      )}

      {/* Header registro */}
      <div className="headerRegistro">

        <p className="registrate">
          Regístrate
        </p>

        <Link className="volver" to="/login">
          Volver
          <img src={arrow} alt="Volver" />
        </Link>

      </div>

      {/* Formulario */}

      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        onChange={handleChange}
      />

      <input
        type="text"
        name="apellido"
        placeholder="Apellidos"
        onChange={handleChange}
      />

      <input
        type="text"
        name="username"
        placeholder="Nombre de usuario"
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        onChange={handleChange}
      />

      <input
        type="password"
        name="repetirPassword"
        placeholder="Validar contraseña"
        onChange={handleChange}
      />

      <button type="submit" className="aceptar">
        Aceptar
      </button>

    </form>
  );
}

export default Registro;