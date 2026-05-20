import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

import logo from "../../assets/images/Logo.png";
import user from "../../assets/images/user.svg";
import userCheck from "../../assets/images/user-check.svg";
import bag from "../../assets/images/shopping-bag.svg";
import heart from "../../assets/images/heart.svg";
import menu from "../../assets/images/align-right.svg";
import arrow from "../../assets/images/arrow-left.svg";
import filterIcon from "../../assets/images/settings.svg";

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
    <header className="sticky top-0 z-50 grid grid-cols-3 items-center px-5 py-3 w-full bg-white shadow-md">

      {/* IZQUIERDA */}
      <div className="flex items-center">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="h-14 object-contain cursor-pointer"
          />
        </Link>
      </div>

      {/* CENTRO */}
      <div className="flex justify-center">

        {isShop && (
          <div className="relative flex items-center gap-3">

            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 text-sm uppercase tracking-wide"
            >
              Filter
              <img src={filterIcon} alt="filter" className="h-4" />
            </button>

            {showFilter && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white border rounded-xl p-2 shadow-lg">

                <input
                  type="text"
                  placeholder="Buscar productos..."
                  onChange={handleFilterChange}
                  className="min-w-[260px] px-5 py-3 text-sm border rounded-lg outline-none"
                />

              </div>
            )}

          </div>
        )}

      </div>

      {/* DERECHA */}
      <div className="flex items-center justify-end gap-5">

        {(isShop || isUser) && (
          <Link to="/">
            <img src={arrow} alt="back" className="h-5 cursor-pointer" />
          </Link>
        )}

        <img
          src={isLogged ? userCheck : user}
          alt="user"
          onClick={handleUserClick}
          className="h-5 cursor-pointer"
        />

        <img
          src={bag}
          alt="bag"
          onClick={() => navigate("/carrito")}
          className="h-5 cursor-pointer"
        />

        {isHome && (
          <>
            <img src={heart} alt="heart" className="h-5" />
            <img src={menu} alt="menu" className="h-5" />
          </>
        )}

      </div>

    </header>
  );
}

export default Header;