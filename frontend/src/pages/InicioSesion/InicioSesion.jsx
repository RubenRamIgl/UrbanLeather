import "./InicioSesion.css";
import arrow from "../../assets/images/arrow-left-circle.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function InicioSesion() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 1. LOGIN → solo token
      const response = await api.post("/login", formData);

      const token = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("isLogged", "true");

      // 2. OBTENER PERFIL PARA SACAR ROL
      const perfil = await api.get("/miPerfil", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const role = perfil.data.roles;

      localStorage.setItem("role", role);

      // 3. REDIRIGIR
      navigate("/");

    } catch (error) {
      console.log(error);
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <form className="formulario" onSubmit={handleLogin}>
      <div className="headerSesion">
        <p className="iniciarSesion">Iniciar Sesión</p>

        <a className="volver" href="/">
          Volver
          <img src={arrow} alt="Volver" />
        </a>
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
        <a href="/registro" className="registrateLink">
          Registrate
        </a>
      </p>
    </form>
  );
}

export default InicioSesion;