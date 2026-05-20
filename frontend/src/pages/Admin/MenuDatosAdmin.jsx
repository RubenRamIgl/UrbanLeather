import "./Admin.css";
import userIcon from "../../assets/images/UserElipse.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import arrow from "../../assets/images/arrow-left-circle.svg";

function MenuDatosAdmin() {

  const navigate = useNavigate();

  // =========================
  // MODOS USUARIO
  // =========================
  const [modoUsuario, setModoUsuario] = useState(null);

  const [showBuscarUsuario, setShowBuscarUsuario] = useState(false);
  const [searchUsername, setSearchUsername] = useState("");

  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    username: "",
    roles: ""
  });

  const [direccion, setDireccion] = useState(null);

  // =========================
  // 🆕 PRODUCTO
  // =========================
  const [showProducto, setShowProducto] = useState(false);
  const [imagenFile, setImagenFile] = useState(null);


  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    color: "",
    categoriaId: ""
  });

  // =========================
  // 🔍 BUSCAR / MODIFICAR PRODUCTO
  // =========================
  const [showBuscarProducto, setShowBuscarProducto] = useState(false);
  const [showModificarProducto, setShowModificarProducto] = useState(false);

  const [searchProducto, setSearchProducto] = useState("");
  const [productoEncontrado, setProductoEncontrado] = useState(null);
  const [productoEditando, setProductoEditando] = useState(null);

  const [showGestionStock, setShowGestionStock] = useState(false);
  const [searchStockProducto, setSearchStockProducto] = useState("");
  const [productoStock, setProductoStock] = useState(null);
  const [tallasStock, setTallasStock] = useState([]);

  const [comprasUsuario, setComprasUsuario] = useState([]);
  const [showComprasUsuario, setShowComprasUsuario] = useState(false);

  const resetVistas = () => {
    setShowProducto(false);
    setShowBuscarProducto(false);
    setShowModificarProducto(false);
    setShowBuscarUsuario(false);
    setShowGestionStock(false);
    setShowComprasUsuario(false);

    setModoUsuario(null);
  };

  // =========================
  // CHANGE PRODUCTO
  // =========================
  const handleProductoChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // CHANGE USUARIO
  // =========================
  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // ABRIR CREAR PRODUCTO
  // =========================
  const handleOpenProducto = () => {

    setShowProducto(true);

    setShowBuscarProducto(false);
    setShowBuscarUsuario(false);

    setModoUsuario(null);
  };

  // =========================
  // 🔍 ABRIR BUSCAR PRODUCTO
  // =========================
  const handleOpenBuscarProducto = () => {

    setShowBuscarProducto(true);

    setShowProducto(false);
    setShowBuscarUsuario(false);

    setProductoEncontrado(null);
    setSearchProducto("");
  };

  // =========================
  // 🔍 BUSCAR PRODUCTO
  // =========================
  const handleBuscarProducto = async () => {

    try {

      const res = await api.get("/productos");

      const producto = res.data.find(
        (p) =>
          p.nombre.toLowerCase() === searchProducto.toLowerCase()
      );

      if (!producto) {
        alert("Producto no encontrado");
        return;
      }

      setProductoEncontrado(producto);

      // 👉 SI ESTÁS EN MODO MODIFICAR
      if (showModificarProducto) {
        setProductoEditando(producto);
      }

    } catch (error) {
      console.log(error);
      alert("Error buscando producto");
    }
  };

  // =========================
  // 📤 CREAR PRODUCTO
  // =========================
  const handleCrearProducto = async () => {

    try {

      const token = localStorage.getItem("token");

      let imageUrl = "";

      if (imagenFile) {

        const formData = new FormData();
        formData.append("file", imagenFile);

        const resImg = await api.post(
          "/files/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );

        imageUrl = resImg.data;
      }

      await api.post(
        "/productoRegister",
        {
          ...producto,
          imagen_url: imageUrl
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Producto creado correctamente");

      setShowProducto(false);

      setProducto({
        nombre: "",
        descripcion: "",
        precio: "",
        color: "",
        categoriaId: ""
      });

      setImagenFile(null);

    } catch (err) {
      console.log(err);
      alert("Error al crear producto");
    }
  };

  // =========================
  // ABRIR MODIFICAR PRODUCTO
  // =========================
  const handleOpenModificarProducto = () => {

    setShowModificarProducto(true);

    setShowBuscarProducto(true);

    setShowProducto(false);
    setShowBuscarUsuario(false);

    setSearchProducto("");
    setProductoEncontrado(null);
    setProductoEditando(null);
  };

  // =========================
  // USUARIOS
  // =========================
  const handleOpenBuscarUsuario = () => {
    setShowBuscarUsuario(true);
    setModoUsuario("preVer");
    setSearchUsername("");
    setDireccion(null);
    setShowProducto(false);
    setShowBuscarProducto(false);
  };

  const handleEditarUsuario = () => {
    setShowBuscarUsuario(true);
    setModoUsuario("preEditar");
    setSearchUsername("");
    setDireccion(null);
    setShowProducto(false);
    setShowBuscarProducto(false);
  };

  const handleOpenEliminarUsuario = () => {
    setShowBuscarUsuario(true);
    setModoUsuario("eliminar");
    setDireccion(null);
  };

  // =========================
    // 👤 BUSCAR USUARIO (VER / EDITAR / ELIMINAR)
    // =========================
    const handleBuscarUsuario = async () => {
      try {

        if (!searchUsername.trim()) {
          alert("Introduce un username");
          return;
        }

        const token = localStorage.getItem("token");

        if (modoUsuario === "eliminar") {

          await api.delete(`/usuarioDelete/${searchUsername}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          alert("Usuario eliminado correctamente");

          setShowBuscarUsuario(false);
          setModoUsuario(null);
          return;
        }

        // =========================
        // VER / EDITAR
        // =========================
        const res = await api.get(
          `/miPerfil?username=${searchUsername}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setUsuario(res.data);
        setShowBuscarUsuario(false);

        if (modoUsuario === "preEditar") {
          setModoUsuario("editar");
          return;
        }

        setModoUsuario("ver");

        try {
          const direccionRes = await api.get(
            `/miDireccion?username=${searchUsername}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          setDireccion(direccionRes.data);

        } catch (err) {
          setDireccion(null);
        }

      } catch (error) {
        alert("Usuario no encontrado");
        console.log(error);
      }
    };


    const handleSubmitUsuario = async (e) => {
      e.preventDefault();

      try {
        const token = localStorage.getItem("token");

        await api.put("/usuarioUpdate", usuario, {
          headers: { Authorization: `Bearer ${token}` }
        });

        alert("Usuario actualizado correctamente");
        setModoUsuario(null);

      } catch (error) {
        console.log(error);
        alert("Error al actualizar usuario");
      }
    };

  const buscarProductoStock = async () => {
    try {
      const res = await api.get("/productos");

      const prod = res.data.find(
        p => p.nombre.toLowerCase() === searchStockProducto.toLowerCase()
      );

      if (!prod) {
        alert("Producto no encontrado");
        return;
      }

      setProductoStock(prod);

      const tallasRes = await api.get(`/tallas/producto/${prod.id}`);

      console.log("TALLAS RESPONSE:", tallasRes.data);
      console.log("ES ARRAY?:", Array.isArray(tallasRes.data));
      setTallasStock(Array.isArray(tallasRes.data) ? tallasRes.data : []);


    } catch (err) {
      console.log(err);
    }
  };

  const cambiarStock = async (tallaId, cantidad) => {
    const talla = tallasStock.find(t => t.id === tallaId);

    const nuevoStock = Number(talla.stock) + cantidad;

    if (nuevoStock < 0) return;

    await api.put(`/tallaUpdate/${tallaId}?stock=${nuevoStock}`);

    const res = await api.get(`/tallas/producto/${productoStock.id}`);
    setTallasStock(Array.isArray(res.data) ? res.data : []);
  };

  const buscarComprasUsuario = async () => {
    try {

      if (!searchUsername.trim()) {
        alert("Introduce un username");
        return;
      }

      const token = localStorage.getItem("token");

      const res = await api.get(
        `/admin/compras/${searchUsername}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log(res.data);
      console.log(Array.isArray(res.data));

      const data = res.data;

      setComprasUsuario(Array.isArray(data) ? data : []);

    } catch (error) {
      console.log(error);
      alert("Error al buscar compras");
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLogged");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="usuarioPage">

      <div className="usuarioHeaderCenter">
        <img src={userIcon} alt="Admin" className="usuarioAvatar" />
      </div>

      <div className="opciones">

        {/* USUARIOS */}
        <p onClick={() => {
          resetVistas();
          handleOpenBuscarUsuario();
        }}>
          Ver usuario
        </p>

        <p onClick={() => {
          resetVistas();
          handleEditarUsuario();
        }}>
          Modificar usuario
        </p>

        <p onClick={() => {
          resetVistas();
          handleOpenEliminarUsuario();
        }}>
          Eliminar usuario
        </p>

        {/* PRODUCTOS */}
        <p onClick={() => {
          resetVistas();
          handleOpenProducto();
        }}>
          Añadir producto
        </p>

        <p onClick={() => {
          resetVistas();
          handleOpenBuscarProducto();
        }}>
          Buscar producto
        </p>

        <p onClick={() => {
          resetVistas();
          handleOpenModificarProducto();
        }}>
          Modificar producto
        </p>

        {/* STOCK */}
        <p onClick={() => {
          resetVistas();
          setShowGestionStock(true);
        }}>
          Gestionar stock tallas
        </p>

        {/* COMPRAS */}
        <p onClick={() => {
          resetVistas();
          setShowComprasUsuario(true);
          setComprasUsuario([]);
          setSearchUsername("");
        }}>
          Ver compras usuario
        </p>

        <p className="logout" onClick={handleLogout}>
          Cerrar sesión
        </p>

      </div>

      {/* ========================= */}
      {/* CREAR PRODUCTO */}
      {/* ========================= */}
      {showProducto && (
        <div className="formDireccion">

          <input name="nombre" placeholder="Nombre" onChange={handleProductoChange} />
          <input name="descripcion" placeholder="Descripción" onChange={handleProductoChange} />
          <input name="precio" placeholder="Precio" onChange={handleProductoChange} />
          <input name="color" placeholder="Color" onChange={handleProductoChange} />

          <select name="categoriaId" onChange={handleProductoChange}>
            <option value="">Selecciona categoría</option>
            <option value="1">Hombre</option>
            <option value="2">Mujer</option>
          </select>

          <input type="file" onChange={(e) => setImagenFile(e.target.files[0])} />

          <button onClick={handleCrearProducto}>
            Crear producto
          </button>

        </div>
      )}

      {showBuscarUsuario && (
              <div className="formDireccion">

                <input
                  type="text"
                  placeholder="Introduce username"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                />

                <button onClick={handleBuscarUsuario}>
                  {modoUsuario === "eliminar" ? "Eliminar usuario" : "Buscar usuario"}
                </button>

              </div>
            )}

            {modoUsuario === "editar" && (
              <form onSubmit={handleSubmitUsuario} className="formDireccion">

                <input name="nombre" value={usuario.nombre} onChange={handleChange} />
                <input name="apellido" value={usuario.apellido} onChange={handleChange} />
                <input name="email" value={usuario.email} onChange={handleChange} />
                <input name="username" value={usuario.username} onChange={handleChange} />

                <button type="submit" className="cerrarSesion">
                  Guardar cambios
                </button>

              </form>
            )}

            {modoUsuario === "ver" && (
              <div className="formDireccion">

                <p>Nombre: {usuario.nombre}</p>
                <p>Apellido: {usuario.apellido}</p>
                <p>Email: {usuario.email}</p>
                <p>Username: {usuario.username}</p>
                <p>Rol: {usuario.roles}</p>

                <hr />

                {direccion ? (
                  <>
                    <p>Dirección:</p>
                    <p>{direccion.calle}, {direccion.numero}</p>
                    <p>{direccion.cp} - {direccion.municipio}</p>
                    <p>{direccion.provincia}</p>
                  </>
                ) : (
                  <p>No tiene dirección registrada</p>
                )}

              </div>
            )}

      {/* ========================= */}
      {/* BUSCAR PRODUCTO */}
      {/* ========================= */}
      {showBuscarProducto && (
        <div className="formDireccion">

          <input
            type="text"
            placeholder="Nombre producto"
            value={searchProducto}
            onChange={(e) => setSearchProducto(e.target.value)}
          />

          <button onClick={handleBuscarProducto}>
            Buscar producto
          </button>

          {productoEncontrado && !showModificarProducto && (
            <div>
              <img src={productoEncontrado.imagen_url} alt="" />
              <p>{productoEncontrado.nombre}</p>
              <p>{productoEncontrado.descripcion}</p>
              <p>{productoEncontrado.precio}€</p>
              <p>{productoEncontrado.color}</p>
            </div>
          )}
        </div>
      )}

      {/* ========================= */}
      {/* MODIFICAR PRODUCTO */}
      {/* ========================= */}
      {showModificarProducto && productoEditando && (
        <div className="formDireccion">

          <input
            value={productoEditando.nombre}
            onChange={(e) =>
              setProductoEditando({ ...productoEditando, nombre: e.target.value })
            }
          />

          <input
            value={productoEditando.descripcion}
            onChange={(e) =>
              setProductoEditando({ ...productoEditando, descripcion: e.target.value })
            }
          />

          <input
            value={productoEditando.precio}
            onChange={(e) =>
              setProductoEditando({ ...productoEditando, precio: e.target.value })
            }
          />

          <input
            value={productoEditando.color}
            onChange={(e) =>
              setProductoEditando({ ...productoEditando, color: e.target.value })
            }
          />

          <input
            type="file"
            onChange={(e) =>
              setProductoEditando({
                ...productoEditando,
                nuevaImagen: e.target.files[0]
              })
            }
          />

          <button onClick={async () => {

            const token = localStorage.getItem("token");

            let imageUrl = productoEditando.imagen_url;

            if (productoEditando.nuevaImagen) {

              const formData = new FormData();
              formData.append("file", productoEditando.nuevaImagen);

              const resImg = await api.post("/files/upload", formData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data"
                }
              });

              imageUrl = resImg.data;
            }

            await api.put(
              `/productoUpdate/${productoEditando.id}`,
              {
                ...productoEditando,
                imagen_url: imageUrl
              },
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );

            alert("Producto actualizado");

            setShowModificarProducto(false);
            setProductoEditando(null);

          }}>
            Guardar cambios
          </button>

        </div>
      )}

      {showGestionStock && (
        <div className="formDireccion">

          <input
            placeholder="Nombre producto"
            value={searchStockProducto}
            onChange={(e) => setSearchStockProducto(e.target.value)}
          />

          <button onClick={buscarProductoStock}>
            Buscar producto
          </button>

          {productoStock && (
            <div>

              <h4>{productoStock.nombre}</h4>

              {tallasStock.map((t) => (
                <div key={t.id} style={{ display: "flex", gap: "10px", alignItems: "center" }}>

                  <span>{t.nombre}</span>

                  <span>Stock: {t.stock}</span>

                  <button onClick={() => cambiarStock(t.id, 1)}>
                    +
                  </button>

                  <button onClick={() => cambiarStock(t.id, -1)}>
                    -
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>
      )}

      {showComprasUsuario && (
        <div className="formDireccion">

          <input
            type="text"
            placeholder="Username usuario"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
          />

          <button onClick={buscarComprasUsuario}>
            Buscar compras
          </button>

        </div>
      )}

       {showComprasUsuario && (
         <div className="formDireccion">

           <h3>Compras del usuario</h3>

           {Array.isArray(comprasUsuario) && comprasUsuario.length > 0 ? (
             comprasUsuario.map((c) => (
               <div key={c.id} style={{ marginBottom: "15px" }}>
                 <p>Producto: {c.nombreProducto}</p>
                 <p>Cantidad: {c.cantidad}</p>
                 <p>Precio unitario: {c.precioUnitario} €</p>

                 <p>Talla: {c.talla?.nombre}</p>

                 <hr />

                 <p>Fecha: {c.compra?.fecha}</p>
                 <p>Total compra: {c.compra?.total} €</p>
                 <hr />
               </div>
             ))
           ) : (
             <p>No hay compras para este usuario</p>
           )}

         </div>
       )}

       {showComprasUsuario && comprasUsuario.length === 0 && (
         <p>No hay compras para este usuario</p>
       )}

    </div>


  );
}

export default MenuDatosAdmin;