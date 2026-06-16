import "./Usuario.css";
import userIcon from "../../assets/images/UserElipse.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function MenuDatosUsuario() {

  const navigate = useNavigate();

  const [modo, setModo] = useState(null);
  // null | "add" | "edit" | "user" | "compras"

  const [datosUsuario, setDatosUsuario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    username: ""
  });

  const [direccion, setDireccion] = useState({
    calle: "",
    numero: "",
    cp: "",
    provincia: "",
    municipio: ""
  });

  // Estado para compras
  const [comprasUsuario, setComprasUsuario] = useState([]);

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

  // =========================
  // MODAL DE CONFIRMACIÓN
  // =========================
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  const mostrarConfirmacion = (mensaje, accion) => {
    setConfirmMessage(mensaje);
    setConfirmAction(() => accion);
    setShowConfirmModal(true);
  };

  const ejecutarConfirmacion = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  // =========================
  // INPUT USUARIO
  // =========================
  const handleChangeUsuario = (e) => {
    setDatosUsuario({
      ...datosUsuario,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // INPUT DIRECCIÓN
  // =========================
  const handleChangeDireccion = (e) => {
    setDireccion({
      ...direccion,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // VER MIS COMPRAS
  // =========================
  const handleVerMisCompras = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/detalleCompra/misDetalles", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setComprasUsuario(res.data);
      setModo("compras");

    } catch (error) {
      console.error("Error al obtener compras:", error);
      mostrarMensaje("Error al cargar tus compras", "error");
    }
  };

  // Función para agrupar compras por ID
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
  //AÑADIR DIRECCIÓN
  // =========================
  const handleAddDireccion = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.get("/miDireccion", {
        headers: { Authorization: `Bearer ${token}` }
      });

      mostrarMensaje("Ya tienes una dirección registrada", "info");

    } catch (error) {
      if (error.response?.status === 404) {
        setDireccion({
          calle: "",
          numero: "",
          cp: "",
          provincia: "",
          municipio: ""
        });

        setModo("add");
      } else {
        console.log(error);
      }
    }
  };

  // =========================
  // EDITAR USUARIO
  // =========================
  const handleEditUsuario = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/miPerfil", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDatosUsuario({
        nombre: res.data.nombre || "",
        apellido: res.data.apellido || "",
        email: res.data.email || "",
        username: res.data.username || ""
      });

      setModo("user");

    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // EDITAR DIRECCIÓN
  // =========================
  const handleEditDireccion = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/miDireccion", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDireccion(res.data);
      setModo("edit");

    } catch (error) {
      if (error.response?.status === 404) {
        mostrarMensaje("No tienes ninguna dirección. Debes crear una antes.", "info");

        setDireccion({
          calle: "",
          numero: "",
          cp: "",
          provincia: "",
          municipio: ""
        });

        setModo("add");
      } else {
        console.log(error);
      }
    }
  };

  // =========================
  // GUARDAR DIRECCIÓN
  // =========================
  const handleSubmitDireccion = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (modo === "add") {
        await api.post("/registerMiDireccion", direccion, {
          headers: { Authorization: `Bearer ${token}` }
        });
        mostrarMensaje("Dirección creada correctamente", "success");
      }

      if (modo === "edit") {
        await api.put("/updateMiDireccion", direccion, {
          headers: { Authorization: `Bearer ${token}` }
        });
        mostrarMensaje("Dirección actualizada correctamente", "success");
      }

      setModo(null);

    } catch (error) {
      console.log(error);
      mostrarMensaje("Error al guardar la dirección", "error");
    }
  };

  // =========================
  // GUARDAR USUARIO
  // =========================
  const handleSubmitUsuario = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const datosActualizados = {};

      if (datosUsuario.nombre.trim() !== "") {
        datosActualizados.nombre = datosUsuario.nombre;
      }
      if (datosUsuario.apellido.trim() !== "") {
        datosActualizados.apellido = datosUsuario.apellido;
      }
      if (datosUsuario.email.trim() !== "") {
        datosActualizados.email = datosUsuario.email;
      }
      if (datosUsuario.username.trim() !== "") {
        datosActualizados.username = datosUsuario.username;
      }

      await api.put("/updateMiPerfil", datosActualizados, {
        headers: { Authorization: `Bearer ${token}` }
      });

      mostrarMensaje("Datos actualizados correctamente", "success");
      setModo(null);

    } catch (error) {
      console.log(error);
      mostrarMensaje("Error al actualizar datos", "error");
    }
  };

  // =========================
  // ELIMINAR DIRECCIÓN
  // =========================
  const handleDeleteDireccion = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.delete("/deleteMiDireccion", {
        headers: { Authorization: `Bearer ${token}` }
      });

      mostrarMensaje("Dirección eliminada correctamente", "success");

    } catch (error) {
      if (error.response?.status === 404) {
        mostrarMensaje("No tienes dirección para eliminar", "info");
      } else {
        console.log(error);
        mostrarMensaje("Error al eliminar dirección", "error");
      }
    }
  };

  // =========================
  // ELIMINAR MI USUARIO - NUEVA FUNCIÓN
  // =========================
  const handleEliminarMiUsuario = () => {
    mostrarConfirmacion(
      "¿Estás seguro de que quieres eliminar tu cuenta?\n\n" +
      "Se eliminarán TODOS tus datos:\n" +
      "• Tu perfil de usuario\n" +
      "• Tu carrito de compras\n" +
      "• Tu dirección\n" +
      "• Tu historial de compras\n\n" +
      "Esta acción NO se puede deshacer.",
      ejecutarEliminarUsuario
    );
  };

  const ejecutarEliminarUsuario = async () => {
    try {
      console.log("=== INICIO ELIMINAR MI USUARIO ===");

      const token = localStorage.getItem("token");
      console.log("Token existe:", token ? "SI" : "NO");

      if (!token) {
        mostrarMensaje("No estás autenticado. Inicia sesión nuevamente.", "error");
        return;
      }

      // Obtener el username del usuario actual
      const perfilRes = await api.get("/miPerfil", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const username = perfilRes.data.username;
      console.log("Username a eliminar:", username);

      // Segunda confirmación con el nombre de usuario
      mostrarConfirmacion(
        `¿Estás seguro de eliminar la cuenta de "${username}"?\n\n` +
        `Todos tus datos serán eliminados permanentemente.`,
        ejecutarEliminacionFinal
      );

    } catch (error) {
      console.log("=== ERROR AL ELIMINAR USUARIO ===");

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);

        if (error.response.status === 500) {
          mostrarMensaje("Error al eliminar la cuenta. Por favor, intenta más tarde.", "error");
        } else if (error.response.status === 404) {
          mostrarMensaje("Usuario no encontrado", "error");
        } else {
          mostrarMensaje(`Error: ${error.response.data || 'Error desconocido'}`, "error");
        }
      } else if (error.request) {
        console.log("No se recibió respuesta del servidor");
        mostrarMensaje("Error de conexión. Verifica tu red.", "error");
      } else {
        console.log("Error:", error.message);
        mostrarMensaje(`Error: ${error.message}`, "error");
      }
    }
  };

  const ejecutarEliminacionFinal = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("Enviando petición DELETE a /borrarMiCuenta...");

      // Llamar al endpoint para eliminar la cuenta
      const response = await api.delete("/borrarMiCuenta", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("RESPUESTA DEL SERVIDOR:");
      console.log("Status:", response.status);
      console.log("Data:", response.data);

      mostrarMensaje("Tu cuenta ha sido eliminada correctamente", "success");

      // Limpiar localStorage y redirigir al login
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("isLogged");
        localStorage.removeItem("role");
        navigate("/login");
      }, 1500);

      console.log("=== USUARIO ELIMINADO CORRECTAMENTE ===");

    } catch (error) {
      console.log("=== ERROR AL ELIMINAR USUARIO ===");

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);

        if (error.response.status === 500) {
          mostrarMensaje("Error al eliminar la cuenta. Por favor, intenta más tarde.", "error");
        } else if (error.response.status === 404) {
          mostrarMensaje("Usuario no encontrado", "error");
        } else {
          mostrarMensaje(`Error: ${error.response.data || 'Error desconocido'}`, "error");
        }
      } else if (error.request) {
        console.log("No se recibió respuesta del servidor");
        mostrarMensaje("Error de conexión. Verifica tu red.", "error");
      } else {
        console.log("Error:", error.message);
        mostrarMensaje(`Error: ${error.message}`, "error");
      }
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

      {/* ========================= */}
      {/* SISTEMA DE NOTIFICACIONES */}
      {/* ========================= */}
      {mensaje && (
        <div className={`mensaje-notificacion ${tipoMensaje}`}>
          {mensaje}
        </div>
      )}

      {/* ========================= */}
      {/* MODAL DE CONFIRMACIÓN */}
      {/* ========================= */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar acción</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{confirmMessage}</p>
            <div className="modal-buttons">
              <button
                className="modal-btn-cancelar"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancelar
              </button>
              <button
                className="modal-btn-confirmar"
                onClick={ejecutarConfirmacion}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AVATAR */}
      <div className="usuarioHeaderCenter">
        <img src={userIcon} alt="User" className="usuarioAvatar" />
      </div>

      {/* MENÚ */}
      <div className="opciones">

        <p onClick={() => navigate("/usuario/datos")}>
          Ver datos
        </p>

        <p onClick={handleEditUsuario}>
          Modificar datos
        </p>

        <p onClick={handleAddDireccion}>
          Añadir dirección
        </p>

        <p onClick={handleEditDireccion}>
          Modificar dirección
        </p>

        <p onClick={handleDeleteDireccion}>
          Eliminar dirección
        </p>

        <p onClick={handleVerMisCompras}>
          Ver mis compras
        </p>

        {/* ELIMINAR MI USUARIO - AHORA FUNCIONAL */}
        <p onClick={handleEliminarMiUsuario} className="eliminar-cuenta">
          Eliminar mi usuario
        </p>

        <p className="logout" onClick={handleLogout}>
          Cerrar sesión
        </p>

      </div>

      {/* FORM DIRECCIÓN */}
      {(modo === "add" || modo === "edit") && (
        <form onSubmit={handleSubmitDireccion} className="formDireccion">

          <input name="calle" value={direccion.calle} onChange={handleChangeDireccion} placeholder="Calle" />
          <input name="numero" value={direccion.numero} onChange={handleChangeDireccion} placeholder="Número" />
          <input name="cp" value={direccion.cp} onChange={handleChangeDireccion} placeholder="Código postal" />
          <input name="provincia" value={direccion.provincia} onChange={handleChangeDireccion} placeholder="Provincia" />
          <input name="municipio" value={direccion.municipio} onChange={handleChangeDireccion} placeholder="Municipio" />

          <button type="submit" className="cerrarSesion">
            {modo === "add" ? "Guardar dirección" : "Actualizar dirección"}
          </button>

        </form>
      )}

      {/* FORM USUARIO */}
      {modo === "user" && (
        <form onSubmit={handleSubmitUsuario} className="formDireccion">

          <input name="nombre" value={datosUsuario.nombre} onChange={handleChangeUsuario} placeholder="Nombre" />
          <input name="apellido" value={datosUsuario.apellido} onChange={handleChangeUsuario} placeholder="Apellido" />
          <input name="email" value={datosUsuario.email} onChange={handleChangeUsuario} placeholder="Email" />
          <input name="username" value={datosUsuario.username} onChange={handleChangeUsuario} placeholder="Username" />

          <button type="submit" className="cerrarSesion">
            Actualizar datos
          </button>

        </form>
      )}

      {/* VER MIS COMPRAS */}
      {modo === "compras" && (
        <div className="formDireccion">
          <h3 className="compras-titulo">Mis compras</h3>

          {comprasUsuario.length > 0 ? (
            <div className="compras-container">
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
                    <p><strong>Total:</strong> ${compra.total?.toFixed(2) || compra.total} €</p>
                  </div>

                  <h4 className="productos-subtitulo">Productos:</h4>
                  {compra.detalles.map((detalle, idx) => (
                    <div key={idx} className="producto-item">
                      <p className="producto-nombre">{detalle.nombreProducto}</p>
                      <p className="producto-detalles">
                        Talla: {detalle.talla} | Cantidad: {detalle.cantidad} | Precio: ${detalle.precioUnitario?.toFixed(2)} €
                      </p>
                    </div>
                  ))}
                  <hr className="separador" />
                </div>
              ))}

              <div className="compras-resumen">
                <p><strong>Total gastado:</strong> ${comprasUsuario.reduce((sum, d) => sum + (d.precioUnitario * d.cantidad), 0).toFixed(2)} €</p>
                <p><strong>Total de productos:</strong> {comprasUsuario.reduce((sum, d) => sum + d.cantidad, 0)} unidades</p>
                <p><strong>Número de pedidos:</strong> {new Set(comprasUsuario.map(d => d.compraId)).size}</p>
              </div>
            </div>
          ) : (
            <p className="no-compras">No tienes compras realizadas</p>
          )}

          <button onClick={() => setModo(null)} className="cerrarSesion">
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}

export default MenuDatosUsuario;