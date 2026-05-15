import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import logo from "../../assets/images/Logo.png";
import user from "../../assets/images/user.svg";
import userCheck from "../../assets/images/user-check.svg";
import bag from "../../assets/images/shopping-bag.svg";
import heart from "../../assets/images/heart.svg";
import menu from "../../assets/images/align-right.svg";
import arrow from "../../assets/images/arrow-left.svg";

import sortIcon from "../../assets/images/sort.svg";
import filterIcon from "../../assets/images/settings.svg";

import "./Header.css";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showFilter, setShowFilter] = useState(false);

  const isHome = location.pathname === "/";
  const isShop =
    location.pathname === "/hombre" || location.pathname === "/mujer";

  const isUser = location.pathname === "/usuario";

  const isLogged = localStorage.getItem("isLogged") === "true";
  const role = localStorage.getItem("role");

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

  // 🔥 FILTRO EN TIEMPO REAL (actualiza URL)
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

      <img src={logo} alt="Logo" />

      {isShop && (
        <div className="central">

          <a
            className="filter"
            onClick={() => setShowFilter(!showFilter)}
            style={{ cursor: "pointer" }}
          >
            Filter
            <img src={filterIcon} alt="filter" />
          </a>

          {showFilter && (
            <div className="filter-box">
              <input
                type="text"
                placeholder="Buscar productos..."
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>
          )}

        </div>
      )}

      <div className="icons">

        {isShop && (
          <Link to="/">
            <img src={arrow} alt="back" />
          </Link>
        )}

        {isUser && (
          <Link to="/">
            <img src={arrow} alt="back" />
          </Link>
        )}

        <img
          src={isLogged ? userCheck : user}
          alt="user"
          onClick={handleUserClick}
          style={{ cursor: "pointer" }}
        />

        <img
          src={bag}
          alt="bag"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/carrito")}
        />

        {isHome && (
          <>
            <img src={heart} alt="heart" />
            <img src={menu} alt="menu" />
          </>
        )}

      </div>
    </header>
  );
}

export default Header;