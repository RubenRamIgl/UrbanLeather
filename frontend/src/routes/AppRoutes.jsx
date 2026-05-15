import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import SeccionHombres from "../pages/SeccionHombres/SeccionHombres";
import SeccionMujer from "../pages/SeccionMujer/SeccionMujer";
import InicioSesion from "../pages/InicioSesion/InicioSesion";
import Registro from "../pages/Registro/Registro";

import Usuario from "../pages/Usuario/Usuario";
import DatosUsuario from "../pages/Usuario/DatosUsuario";
import MenuDatosUsuario from "../pages/Usuario/MenuDatosUsuario";

import MenuDatosAdmin from "../pages/Admin/MenuDatosAdmin";

import Producto from "../pages/Producto/Producto";
import Carrito from "../pages/Carrito/Carrito";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hombre" element={<SeccionHombres />} />
      <Route path="/mujer" element={<SeccionMujer />} />
      <Route path="/login" element={<InicioSesion />} />
      <Route path="/registro" element={<Registro />} />

      {/* USER */}
      <Route path="/usuario" element={<Usuario />} />
      <Route path="/usuario/datos" element={<DatosUsuario />} />
      <Route path="/usuario/menuDatos" element={<MenuDatosUsuario />} />

      {/* ADMIN */}
      <Route path="/admin/menu" element={<MenuDatosAdmin />} />

      <Route path="/producto/:id" element={<Producto />} />
      <Route path="/carrito" element={<Carrito />} />

    </Routes>
  );
}

export default AppRoutes;