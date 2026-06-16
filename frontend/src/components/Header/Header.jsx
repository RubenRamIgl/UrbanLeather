import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import logo from "../../assets/images/Logo.png";
import user from "../../assets/images/user.svg";
import userCheck from "../../assets/images/user-check.svg";
import menu from "../../assets/images/align-right.svg";
import bag from "../../assets/images/shopping-bag.svg";
import arrow from "../../assets/images/arrow-left.svg";
import filterIcon from "../../assets/images/settings.svg";
import "./Header.css";
import ThemeToggle from "./ThemeToggle";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);

  const token = localStorage.getItem("token");
  const isLogged = !!token;

  const role = localStorage.getItem("role");

  const isHome = location.pathname === "/";
  const isShop =
    location.pathname === "/hombre" ||
    location.pathname === "/mujer";

  const isUser = location.pathname === "/usuario";

  const handleUserClick = () => {
    if (!isLogged) {
      navigate("/login");
      return;
    }

    if (role === "ADMIN") {
      navigate("/admin/menu");
    } else {
      navigate("/usuario/menuDatos");
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;

    const path =
      location.pathname === "/hombre"
        ? "/hombre"
        : location.pathname === "/mujer"
        ? "/mujer"
        : location.pathname;

    navigate(`${path}?filter=${value}`);
  };

  return (
    <header className="header">

      {/* IZQUIERDA */}
      <div className="header-izquierda">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="header-logo"
          />
        </Link>
      </div>

      {/* CENTRO */}
      <div className="header-centro">

        {isShop && (
          <div className="header-filtro-container">

            <button
              onClick={() => setShowFilter(!showFilter)}
              className="header-filtro-boton"
            >
              Filter
              <img src={filterIcon} alt="filter" className="header-filtro-icono" />
            </button>

            {showFilter && (
              <div className="header-filtro-dropdown">

                <input
                  type="text"
                  placeholder="Buscar productos..."
                  onChange={handleFilterChange}
                  className="header-filtro-input"
                />

              </div>
            )}

          </div>
        )}

      </div>

      {/* DERECHA */}
      <div className="header-derecha">

        <ThemeToggle />

        {(isShop || isUser) && (
          <Link to="/">
            <img src={arrow} alt="back" className="header-icono" />
          </Link>
        )}

        <img
          src={isLogged ? userCheck : user}
          alt="user"
          onClick={handleUserClick}
          className="header-icono"
        />

        <img
          src={bag}
          alt="bag"
          onClick={() => navigate("/carrito")}
          className="header-icono"
        />

        {isHome && (
          <img src={menu} alt="menu" className="header-icono" />
        )}

      </div>

    </header>
  );
}

export default Header;