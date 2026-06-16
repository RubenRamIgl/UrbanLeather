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
  // PRODUCTO
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
  // BUSCAR / MODIFICAR PRODUCTO
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
  const [cargandoCompras, setCargandoCompras] = useState(false);

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

  const resetVistas = () => {
    setShowProducto(false);
    setShowBuscarProducto(false);
    setShowModificarProducto(false);
    setShowBuscarUsuario(false);
    setShowGestionStock(false);
    setShowComprasUsuario(false);
    setModoUsuario(null);
    setComprasUsuario([]);
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
  // ABRIR BUSCAR PRODUCTO
  // =========================
  const handleOpenBuscarProducto = () => {
    setShowBuscarProducto(true);
    setShowProducto(false);
    setShowBuscarUsuario(false);
    setProductoEncontrado(null);
    setSearchProducto("");
  };

  // =========================
  // BUSCAR PRODUCTO
  // =========================
  const handleBuscarProducto = async () => {
    try {
      const res = await api.get("/productos");
      const producto = res.data.find(
        (p) => p.nombre.toLowerCase() === searchProducto.toLowerCase()
      );

      if (!producto) {
        mostrarMensaje("Producto no encontrado", "error");
        return;
      }

      setProductoEncontrado(producto);

      if (showModificarProducto) {
        setProductoEditando(producto);
      }
    } catch (error) {
      console.log(error);
      mostrarMensaje("Error buscando producto", "error");
    }
  };

  // =========================
  // CREAR PRODUCTO
  // =========================
  const handleCrearProducto = async () => {
    try {
      const token = localStorage.getItem("token");
      let imageUrl = "";

      if (imagenFile) {
        const formData = new FormData();
        formData.append("file", imagenFile);
        const resImg = await api.post("/files/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
        imageUrl = resImg.data;
      }

      await api.post("/productoRegister", {
        ...producto,
        imagen_url: imageUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      mostrarMensaje("Producto creado correctamente", "success");
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
      mostrarMensaje("Error al crear producto", "error");
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
  // BUSCAR USUARIO (VER / EDITAR / ELIMINAR)
  // =========================
  const handleBuscarUsuario = async () => {
    try {
      if (!searchUsername.trim()) {
        mostrarMensaje("Introduce un username", "error");
        return;
      }

      const token = localStorage.getItem("token");

      if (modoUsuario === "eliminar") {
        await api.delete(`/usuarioDelete/${searchUsername}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        mostrarMensaje("Usuario eliminado correctamente", "success");
        setShowBuscarUsuario(false);
        setModoUsuario(null);
        return;
      }

      const res = await api.get(`/miPerfil?username=${searchUsername}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsuario(res.data);
      setShowBuscarUsuario(false);

      if (modoUsuario === "preEditar") {
        setModoUsuario("editar");
        return;
      }

      setModoUsuario("ver");

      try {
        const direccionRes = await api.get(`/miDireccion?username=${searchUsername}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDireccion(direccionRes.data);
      } catch (err) {
        setDireccion(null);
      }
    } catch (error) {
      mostrarMensaje("Usuario no encontrado", "error");
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
      mostrarMensaje("Usuario actualizado correctamente", "success");
      setModoUsuario(null);
    } catch (error) {
      console.log(error);
      mostrarMensaje("Error al actualizar usuario", "error");
    }
  };

  const buscarProductoStock = async () => {
    try {
      const res = await api.get("/productos");
      const prod = res.data.find(
        p => p.nombre.toLowerCase() === searchStockProducto.toLowerCase()
      );
      if (!prod) {
        mostrarMensaje("Producto no encontrado", "error");
        return;
      }
      setProductoStock(prod);
      const tallasRes = await api.get(`/tallas/producto/${prod.id}`);
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

  // =========================
  // BUSCAR COMPRAS DEL USUARIO
  // =========================
  const buscarComprasUsuario = async () => {
    try {
      if (!searchUsername.trim()) {
        mostrarMensaje("Introduce un username", "error");
        return;
      }

      setCargandoCompras(true);
      const token = localStorage.getItem("token");

      const res = await api.get(`/detalleCompra/misDetalles?username=${searchUsername}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Respuesta completa:", res.data);

      if (Array.isArray(res.data)) {
        setComprasUsuario(res.data);
        if (res.data.length === 0) {
          mostrarMensaje("Este usuario no tiene compras registradas", "info");
        }
      } else {
        setComprasUsuario([]);
        mostrarMensaje("Formato de datos incorrecto", "error");
      }
    } catch (error) {
      console.error("Error al buscar compras:", error);
      mostrarMensaje("Error al buscar compras del usuario", "error");
      setComprasUsuario([]);
    } finally {
      setCargandoCompras(false);
    }
  };

  const agruparComprasPorId = (detalles) => {
    const comprasMap = new Map();

    detalles.forEach(detalle => {
      const compraId = detalle.compraId;
      if (!comprasMap.has(compraId)) {
        comprasMap.set(compraId, {
          id: compraId,
          fecha: detalle.fechaCompra,
          estado: detalle.estadoCompra,
          total: detalle.totalCompra,
          detalles: []
        });
      }
      comprasMap.get(compraId).detalles.push(detalle);
    });

    return Array.from(comprasMap.values());
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
    <div className="adminPage">
      {/* ========================= */}
      {/* SISTEMA DE NOTIFICACIONES */}
      {/* ========================= */}
      {mensaje && (
        <div className={`mensaje-notificacion ${tipoMensaje}`}>
          {mensaje}
        </div>
      )}

      <div className="adminHeaderCenter">
        <img src={userIcon} alt="Admin" className="adminAvatar" />
      </div>

      <div className="opciones">
        <p onClick={() => { resetVistas(); handleOpenBuscarUsuario(); }}>Ver usuario</p>
        <p onClick={() => { resetVistas(); handleEditarUsuario(); }}>Modificar usuario</p>
        <p onClick={() => { resetVistas(); handleOpenEliminarUsuario(); }}>Eliminar usuario</p>
        <p onClick={() => { resetVistas(); handleOpenProducto(); }}>Añadir producto</p>
        <p onClick={() => { resetVistas(); handleOpenBuscarProducto(); }}>Buscar producto</p>
        <p onClick={() => { resetVistas(); handleOpenModificarProducto(); }}>Modificar producto</p>
        <p onClick={() => { resetVistas(); setShowGestionStock(true); }}>Gestionar stock tallas</p>
        <p onClick={() => { resetVistas(); setShowComprasUsuario(true); setComprasUsuario([]); setSearchUsername(""); }}>Ver compras usuario</p>
        <p className="logout" onClick={handleLogout}>Cerrar sesión</p>
      </div>

      {/* ========================= */}
      {/* CREAR PRODUCTO - MEJORADO */}
      {/* ========================= */}
      {showProducto && (
        <div className="form-card">
          <h3>Crear nuevo producto</h3>
          <div className="formDireccion">
            <div className="input-group">
              <label>NOMBRE</label>
              <input name="nombre" placeholder="Ej: Camiseta Oversize" onChange={handleProductoChange} />
            </div>
            <div className="input-group">
              <label>DESCRIPCIÓN</label>
              <input name="descripcion" placeholder="Descripción del producto" onChange={handleProductoChange} />
            </div>
            <div className="input-group">
              <label>PRECIO (€)</label>
              <input name="precio" type="number" step="0.01" placeholder="0.00" onChange={handleProductoChange} />
            </div>
            <div className="input-group">
              <label>COLOR</label>
              <input name="color" placeholder="Ej: Negro, Blanco, Rojo" onChange={handleProductoChange} />
            </div>
            <div className="input-group">
              <label>CATEGORÍA</label>
              <select name="categoriaId" onChange={handleProductoChange}>
                <option value="">Selecciona categoría</option>
                <option value="1">Hombre</option>
                <option value="2">Mujer</option>
              </select>
            </div>
            <div className="input-group">
              <label>IMAGEN</label>
              <input type="file" onChange={(e) => setImagenFile(e.target.files[0])} />
            </div>
            <button onClick={handleCrearProducto}>Crear producto</button>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* BUSCAR USUARIO - MEJORADO */}
      {/* ========================= */}
      {showBuscarUsuario && (
        <div className="form-card">
          <h3>{modoUsuario === "eliminar" ? "Eliminar usuario" : "Buscar usuario"}</h3>
          <div className="formDireccion">
            <div className="input-group">
              <label>USERNAME</label>
              <input
                type="text"
                placeholder="Introduce el username"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
              />
            </div>
            <button onClick={handleBuscarUsuario}>
              {modoUsuario === "eliminar" ? "Eliminar usuario" : "Buscar usuario"}
            </button>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* EDITAR USUARIO - MEJORADO */}
      {/* ========================= */}
      {modoUsuario === "editar" && (
        <div className="form-card">
          <h3>Editar usuario</h3>
          <form onSubmit={handleSubmitUsuario} className="formDireccion">
            <div className="input-group">
              <label>NOMBRE</label>
              <input name="nombre" value={usuario.nombre} onChange={handleChange} placeholder="Nombre" />
            </div>
            <div className="input-group">
              <label>APELLIDO</label>
              <input name="apellido" value={usuario.apellido} onChange={handleChange} placeholder="Apellido" />
            </div>
            <div className="input-group">
              <label>EMAIL</label>
              <input name="email" value={usuario.email} onChange={handleChange} placeholder="Email" />
            </div>
            <div className="input-group">
              <label>USERNAME</label>
              <input name="username" value={usuario.username} onChange={handleChange} placeholder="Username" />
            </div>
            <div className="button-group">
              <button type="button" className="secondary" onClick={() => setModoUsuario(null)}>Cancelar</button>
              <button type="submit">Guardar cambios</button>
            </div>
          </form>
        </div>
      )}

      {/* ========================= */}
      {/* VER USUARIO - MEJORADO */}
      {/* ========================= */}
      {modoUsuario === "ver" && (
        <div className="info-card">
          <h3>Información del usuario</h3>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Apellido:</strong> {usuario.apellido}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>Username:</strong> {usuario.username}</p>
          <p><strong>Rol:</strong> {usuario.roles}</p>
          <hr />
          {direccion ? (
            <>
              <p><strong>Dirección:</strong></p>
              <p>{direccion.calle}, {direccion.numero}</p>
              <p>{direccion.cp} - {direccion.municipio}</p>
              <p>{direccion.provincia}</p>
            </>
          ) : (
            <p>No tiene dirección registrada</p>
          )}
          <button className="secondary" onClick={() => setModoUsuario(null)} style={{ marginTop: "16px", width: "100%" }}>Cerrar</button>
        </div>
      )}

      {/* ========================= */}
      {/* BUSCAR PRODUCTO - MEJORADO */}
      {/* ========================= */}
      {showBuscarProducto && (
        <div className="form-card">
          <h3>Buscar producto</h3>
          <div className="formDireccion">
            <div className="input-group">
              <label>NOMBRE DEL PRODUCTO</label>
              <input
                type="text"
                placeholder="Ej: Camiseta, Pantalón..."
                value={searchProducto}
                onChange={(e) => setSearchProducto(e.target.value)}
              />
            </div>
            <button onClick={handleBuscarProducto}>Buscar producto</button>
            {productoEncontrado && !showModificarProducto && (
              <div className="producto-encontrado">
                <img src={productoEncontrado.imagen_url} alt="" />
                <p><strong>Nombre:</strong> {productoEncontrado.nombre}</p>
                <p><strong>Descripción:</strong> {productoEncontrado.descripcion}</p>
                <p><strong>Precio:</strong> {productoEncontrado.precio}€</p>
                <p><strong>Color:</strong> {productoEncontrado.color}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* MODIFICAR PRODUCTO - MEJORADO */}
      {/* ========================= */}
      {showModificarProducto && productoEditando && (
        <div className="form-card">
          <h3>Modificar producto</h3>
          <div className="formDireccion">
            <div className="input-group">
              <label>NOMBRE</label>
              <input
                value={productoEditando.nombre}
                onChange={(e) => setProductoEditando({ ...productoEditando, nombre: e.target.value })}
                placeholder="Nombre"
              />
            </div>
            <div className="input-group">
              <label>DESCRIPCIÓN</label>
              <input
                value={productoEditando.descripcion}
                onChange={(e) => setProductoEditando({ ...productoEditando, descripcion: e.target.value })}
                placeholder="Descripción"
              />
            </div>
            <div className="input-group">
              <label>PRECIO (€)</label>
              <input
                value={productoEditando.precio}
                onChange={(e) => setProductoEditando({ ...productoEditando, precio: e.target.value })}
                placeholder="Precio"
              />
            </div>
            <div className="input-group">
              <label>COLOR</label>
              <input
                value={productoEditando.color}
                onChange={(e) => setProductoEditando({ ...productoEditando, color: e.target.value })}
                placeholder="Color"
              />
            </div>
            <div className="input-group">
              <label>IMAGEN</label>
              <input type="file" onChange={(e) => setProductoEditando({ ...productoEditando, nuevaImagen: e.target.files[0] })} />
            </div>
            <div className="button-group">
              <button type="button" className="secondary" onClick={() => setShowModificarProducto(false)}>Cancelar</button>
              <button onClick={async () => {
                const token = localStorage.getItem("token");
                let imageUrl = productoEditando.imagen_url;
                if (productoEditando.nuevaImagen) {
                  const formData = new FormData();
                  formData.append("file", productoEditando.nuevaImagen);
                  const resImg = await api.post("/files/upload", formData, {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
                  });
                  imageUrl = resImg.data;
                }
                await api.put(`/productoUpdate/${productoEditando.id}`, {
                  ...productoEditando,
                  imagen_url: imageUrl
                }, { headers: { Authorization: `Bearer ${token}` } });
                mostrarMensaje("Producto actualizado", "success");
                setShowModificarProducto(false);
                setProductoEditando(null);
              }}>Guardar cambios</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* GESTIONAR STOCK - MEJORADO */}
      {/* ========================= */}
      {showGestionStock && (
        <div className="form-card">
          <h3>Gestionar stock</h3>
          <div className="formDireccion">
            <div className="input-group">
              <label>PRODUCTO</label>
              <input
                placeholder="Nombre del producto"
                value={searchStockProducto}
                onChange={(e) => setSearchStockProducto(e.target.value)}
              />
            </div>
            <button onClick={buscarProductoStock}>Buscar producto</button>
            {productoStock && (
              <div>
                <h4>{productoStock.nombre}</h4>
                {tallasStock.map((t) => (
                  <div key={t.id} className="stock-item">
                    <span><strong>{t.nombre}</strong></span>
                    <span>Stock: {t.stock}</span>
                    <div className="stock-controls">
                      <button onClick={() => cambiarStock(t.id, 1)}>+</button>
                      <button onClick={() => cambiarStock(t.id, -1)}>-</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* VER COMPRAS USUARIO - MEJORADO */}
      {/* ========================= */}
      {showComprasUsuario && (
        <div className="form-card">
          <h3>Buscar compras de usuario</h3>
          <div className="formDireccion">
            <div className="input-group">
              <label>USERNAME</label>
              <input
                type="text"
                placeholder="Username del usuario"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
              />
            </div>
            <button onClick={buscarComprasUsuario} disabled={cargandoCompras}>
              {cargandoCompras ? "Buscando..." : "Buscar compras"}
            </button>
          </div>

          {!cargandoCompras && comprasUsuario.length > 0 && (
            <div className="compras-container">
              <h3>Compras del usuario: {searchUsername}</h3>
              {agruparComprasPorId(comprasUsuario).map((compra) => (
                <div key={compra.id} className="compra-card">
                  <div className="compra-header">
                    <p><strong>Pedido #:</strong> {compra.id}</p>
                    <p><strong>Fecha:</strong> {new Date(compra.fecha).toLocaleString()}</p>
                    <p><strong>Estado:</strong>
                      <span className={compra.estado === "PAGADO" ? "estado-pagado" : "estado-pendiente"}>
                        {" "}{compra.estado}
                      </span>
                    </p>
                    <p><strong>Total del pedido:</strong> ${compra.total?.toFixed(2) || compra.total} €</p>
                  </div>
                  <h4>Detalles del pedido:</h4>
                  {compra.detalles.map((detalle, idx) => (
                    <div key={idx} className="producto-item">
                      <p><strong>Producto:</strong> {detalle.nombreProducto}</p>
                      <p><strong>Talla:</strong> {detalle.talla}</p>
                      <p><strong>Cantidad:</strong> {detalle.cantidad}</p>
                      <p><strong>Precio unitario:</strong> ${detalle.precioUnitario?.toFixed(2)} €</p>
                      <p><strong>Subtotal:</strong> ${(detalle.precioUnitario * detalle.cantidad).toFixed(2)} €</p>
                    </div>
                  ))}
                  <hr />
                </div>
              ))}
              <div className="compras-resumen">
                <p><strong>Total gastado:</strong> ${comprasUsuario.reduce((sum, d) => sum + (d.precioUnitario * d.cantidad), 0).toFixed(2)} €</p>
              </div>
            </div>
          )}

          {!cargandoCompras && comprasUsuario.length === 0 && searchUsername && (
            <p className="no-compras">No hay compras para el usuario "{searchUsername}"</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MenuDatosAdmin;