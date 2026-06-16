# URBANLEATHER

## 📌 Idea de la Aplicación

UrbanLeather es una tienda online de ropa desarrollada con Spring Boot y React.  
La aplicación permite a los usuarios registrarse, iniciar sesión y gestionar productos dependiendo de su rol dentro del sistema.

Existen dos tipos de usuarios:

- `USER`: puede visualizar productos y realizar acciones relacionadas con su cuenta.
- `ADMIN`: tiene acceso a herramientas de administración como gestión de productos, usuarios y contenido de la tienda.

La aplicación está diseñada siguiendo una arquitectura cliente-servidor, separando el backend desarrollado con Spring Boot del frontend desarrollado con React.

## 🔹 Funcionalidades principales

### 👤 Funcionalidades USER
- Visualizar sus propios datos personales.
- Modificar su perfil de usuario.
- Eliminar su cuenta.
- Añadir una dirección asociada a su cuenta.
- Modificar su dirección.
- Eliminar su dirección.
- Añadir productos al carrito.
- Vaciar el carrito de compra.
- Cerrar sesión.

---

### 🛠️ Funcionalidades ADMIN
- Visualizar información de cualquier usuario.
- Modificar usuarios existentes.
- Eliminar usuarios.
- Añadir nuevos productos.
- Buscar productos.
- Modificar productos existentes.
- Gestionar el stock de productos por talla.
- Añadir productos al carrito.
- Vaciar el carrito.
- Cerrar sesión.

---

## 🧠 Lógica de Negocio

### 🔹 Usuarios

- Existen dos tipos de roles:
    - `USER`
    - `ADMIN`

- Los usuarios deben iniciar sesión para acceder a funcionalidades privadas.
- Cada usuario únicamente puede modificar o eliminar su propia cuenta, excepto los administradores.
- Las contraseñas se almacenan cifradas en la base de datos.
- Cada usuario puede tener asociada una dirección.
- Al eliminar un usuario, también podrán eliminarse sus datos asociados según la configuración de las relaciones.

---

### 🔹 Productos

- Los productos pueden ser creados y administrados únicamente por usuarios con rol `ADMIN`.
- Cada producto dispone de stock independiente según la talla.
- El stock nunca puede ser negativo.
- Los administradores pueden aumentar o reducir el stock de cada talla disponible.
- Los productos pueden buscarse mediante distintos criterios definidos en la aplicación.

---

### 🔹 Carrito

- Tanto los usuarios `USER` como `ADMIN` pueden añadir productos al carrito.
- El carrito puede vaciarse completamente.
- Solo se pueden añadir productos con stock disponible.
- La cantidad de productos añadidos no puede superar el stock existente para la talla seleccionada.

---

## 🗄️ Base de Datos

La base de datos de **UrbanLeather** está compuesta por varias entidades que representan la lógica completa de la tienda online: usuarios, direcciones, productos, categorías, tallas, carrito y compras.

---

## 📌 Usuarios

| Campo     | Tipo     | Restricciones |
|----------|----------|--------------|
| id       | Long     | PK, autoincremental |
| nombre   | String   | NOT NULL |
| apellido | String   | NOT NULL |
| email    | String   | NOT NULL, UNIQUE |
| username | String   | NOT NULL, UNIQUE |
| password | String   | NOT NULL |
| roles    | Enum     | USER / ADMIN |

### Relaciones
- 1 usuario → 1 dirección
- 1 usuario → N compras
- 1 usuario → 1 carrito

---

## 📌 Direcciones

| Campo     | Tipo   | Restricciones |
|----------|--------|--------------|
| id       | Long   | PK, autoincremental |
| calle    | String | NOT NULL |
| numero   | int    | NOT NULL |
| cp       | String | NOT NULL |
| provincia| String | NOT NULL |
| municipio| String | NOT NULL |
| usuario  | Usuario| FK, NOT NULL |

### Relaciones
- N direcciones → 1 usuario *(aunque en lógica actual es 1:1 controlado)*

---

## 📌 Categorías

| Campo   | Tipo   | Restricciones |
|--------|--------|--------------|
| id     | Long   | PK |
| nombre | String | NOT NULL |

Valores posibles:
- Hombre
- Mujer

### Relaciones
- 1 categoría → N productos

---

## 📌 Productos

| Campo       | Tipo        | Restricciones |
|------------|-------------|--------------|
| id         | Long        | PK |
| nombre     | String      | NOT NULL |
| descripcion| String      | NOT NULL |
| precio     | BigDecimal  | NOT NULL |
| color      | String      | NOT NULL |
| imagenUrl  | String      | NOT NULL |
| categoria  | Categoria   | FK |

### Relaciones
- 1 producto → N tallas
- 1 producto → 1 categoría
- 1 producto → N items de carrito
- 1 producto → N detalles de compra

---

## 📌 Tallas

| Campo     | Tipo | Restricciones |
|----------|------|--------------|
| id       | Long | PK |
| nombre   | Enum | S / M / L / XL |
| stock    | int  | NOT NULL |
| producto | Producto | FK |

### Reglas importantes
- No puede existir duplicado de talla por producto
- El stock nunca puede ser negativo

---

## 📌 Carrito

| Campo   | Tipo   | Restricciones |
|--------|--------|--------------|
| id     | Long   | PK |
| usuario| Usuario| FK UNIQUE |

### Relaciones
- 1 carrito → N items
- 1 usuario → 1 carrito

---

## 📌 Carrito Items

| Campo    | Tipo     | Restricciones |
|----------|----------|--------------|
| id       | Long     | PK |
| carrito  | Carrito  | FK |
| producto | Producto | FK |
| talla    | Talla    | FK |
| cantidad | int      | NOT NULL |

---

## 📌 Compras

| Campo   | Tipo        | Restricciones |
|--------|-------------|--------------|
| id     | Long        | PK |
| usuario| Usuario     | FK |
| fecha  | LocalDateTime | NOT NULL |
| estado | Enum        | PENDIENTE / PAGADO / ENVIADO / CANCELADO |
| total  | BigDecimal  | NOT NULL |

### Relaciones
- 1 compra → N detalles
- N compras → 1 usuario

---

## 📌 Detalle de Compra

| Campo           | Tipo        | Restricciones |
|----------------|-------------|--------------|
| id             | Long        | PK |
| compra         | Compra      | FK |
| producto       | Producto    | FK |
| talla          | Talla       | FK |
| cantidad       | int         | NOT NULL |
| precioUnitario | BigDecimal  | NOT NULL |
| nombreProducto | String      | histórico |

---

## 🔗 Resumen de relaciones

- Usuario → Dirección (1:1)
- Usuario → Carrito (1:1)
- Usuario → Compras (1:N)
- Producto → Tallas (1:N)
- Producto → Categoría (N:1)
- Carrito → Items (1:N)
- Compra → Detalles (1:N)
- Producto → DetallesCompra (1:N)

---

## 📡 API REST - Endpoints

La aplicación expone una API REST dividida por módulos: usuarios, direcciones, productos, categorías, tallas, carrito y compras.

> 🔒 Todos los endpoints (excepto `/login` y `/register`) requieren autenticación mediante JWT.

---

## 👤 UsuarioController

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/login` | Inicio de sesión | Público |
| POST | `/register` | Registro de usuario | Público |
| PUT | `/usuarioUpdate` | Actualizar usuario | ADMIN |
| DELETE | `/usuarioDelete/{username}` | Eliminar usuario | ADMIN |
| DELETE | `/borrarMiCuenta` | Eliminar cuenta propia | USER / ADMIN |
| PUT | `/updateMiPerfil` | Actualizar perfil propio | USER / ADMIN |
| GET | `/miPerfil` | Obtener perfil propio o de usuario (ADMIN) | USER / ADMIN |

---

## 🏠 DireccionController

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/direccionRegister` | Crear dirección para usuario | ADMIN |
| PUT | `/direccionUpdate` | Actualizar dirección de usuario | ADMIN |
| DELETE | `/eliminarDireccion/{username}` | Eliminar dirección | ADMIN |
| POST | `/registerMiDireccion` | Crear dirección propia | USER / ADMIN |
| PUT | `/updateMiDireccion` | Actualizar dirección propia | USER / ADMIN |
| DELETE | `/deleteMiDireccion` | Eliminar dirección propia | USER / ADMIN |
| GET | `/miDireccion` | Obtener dirección propia o de usuario (ADMIN) | USER / ADMIN |

---

## 🛍️ ProductoController

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/productoRegister` | Crear producto | ADMIN |
| GET | `/productos` | Listar productos | Público |
| GET | `/productos/{id}` | Obtener producto por ID | Público |
| PUT | `/productoUpdate/{id}` | Actualizar producto | ADMIN |
| DELETE | `/productoDelete/{id}` | Eliminar producto | ADMIN |

---

## 🏷️ CategoriaController

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/categoriaRegister` | Crear categoría | ADMIN |
| GET | `/categorias` | Listar categorías | Público |
| PUT | `/categoriaUpdate/{id}` | Actualizar categoría | ADMIN |
| DELETE | `/categoriaDelete/{id}` | Eliminar categoría | ADMIN |

---

## 👕 TallaController

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/tallaRegister` | Crear talla | ADMIN |
| GET | `/tallas` | Listar tallas | Público |
| GET | `/tallas/producto/{productoId}` | Listar tallas de un producto | Público |
| PUT | `/tallaUpdate/{id}` | Actualizar stock de talla | ADMIN |
| DELETE | `/tallaDelete/{id}` | Eliminar talla | ADMIN |

---

## 🛒 CarritoController

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/carrito` | Ver carrito | USER / ADMIN |
| DELETE | `/carrito/vaciar` | Vaciar carrito | USER / ADMIN |

---

## 🧾 CarritoItemController

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/carrito/item/add` | Añadir producto al carrito | USER / ADMIN |
| DELETE | `/carrito/item/{itemId}` | Eliminar item del carrito | USER / ADMIN |
| PUT | `/carrito/item/{itemId}` | Actualizar cantidad | USER / ADMIN |

---

## 💳 CompraController

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/compraRegister` | Crear compra (ADMIN) | ADMIN |
| POST | `/registerMiCompra` | Crear compra propia | USER / ADMIN |
| DELETE | `/eliminarCompra/{id}` | Eliminar compra | ADMIN |
| DELETE | `/eliminarMiCompra/{id}` | Eliminar compra propia | USER / ADMIN |
| GET | `/misCompras` | Ver compras del usuario | USER / ADMIN |

---

## 📦 DetalleCompraController

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/detalleCompra/add` | Añadir detalle a compra | ADMIN |
| GET | `/detalleCompra/compra/{compraId}` | Ver detalles de una compra | ADMIN / USER |
| DELETE | `/detalleCompra/id/{id}` | Eliminar detalle | ADMIN |
| GET | `/detalleCompra/misDetalles` | Ver detalles del usuario | USER / ADMIN |

---

## 🔒 Seguridad

- Autenticación basada en **JWT**
- Roles:
    - `USER`
    - `ADMIN`
- Acceso controlado por Spring Security
- El token debe enviarse en el header:

```
Authorization: Bearer <token>
```

## ⚠️ Gestión de Errores

La API utiliza un manejador global de excepciones mediante `@ControllerAdvice`, lo que permite devolver respuestas HTTP coherentes y centralizadas según el tipo de error.

---

## 📌 Tipos de errores controlados

| Código HTTP | Tipo de error | Descripción |
|------------|--------------|-------------|
| 400 | Bad Request | Peticiones incorrectas o datos inválidos |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Datos duplicados (email, username, etc.) |
| 403 | Forbidden | Acceso denegado por permisos |
| 500 | Internal Server Error | Error inesperado del servidor |

---

## 🧠 Excepciones personalizadas

El sistema utiliza excepciones propias para controlar la lógica de negocio:

- `PeticionIncorrectaException` → 400 Bad Request
- `NoEncontradoException` → 404 Not Found
- `DuplicadoException` → 409 Conflict
- `AccesoDenegadoException` → 403 Forbidden

---

## 🛠️ Manejador global

Todas las excepciones son gestionadas desde:

```java
@ControllerAdvice
public class ManejadorExcepciones
```

Esto permite centralizar toda la gestión de errores y evitar código repetido en los controllers.

---

## 📌 Ejemplo de respuesta

```json
{
  "message": "El usuario no existe"
}
```

o simplemente:

```
El usuario no existe
```

---

## 🔒 Beneficio del sistema

- Respuestas consistentes en toda la API
- Control centralizado de errores
- Mejora la mantenibilidad del backend
- Facilita el debug y la integración con el frontend


---

### 🔹 Header

El Header es el componente de navegación principal de la aplicación. Se mantiene fijo en la parte superior (sticky) y se adapta según la ruta actual y el estado de autenticación del usuario.

**Características principales:**

- **Logo**: Enlace a la página de inicio (`/`)
- **Filtro de productos**: Aparece solo en las páginas de tienda (`/hombre` y `/mujer`), permite buscar productos por nombre
- **Cambio de tema**: Botón para alternar entre modo claro y oscuro (persistente en localStorage)
- **Navegación de usuario**:
  - Si no está autenticado: redirige a `/login`
  - Si es ADMIN: redirige al panel de administración (`/admin/menu`)
  - Si es USER: redirige a su perfil (`/usuario/menuDatos`)
- **Carrito**: Acceso directo al carrito de compras (`/carrito`)
- **Botón de retroceso**: Aparece en páginas de tienda y perfil para volver al inicio

**Comportamiento responsive**: Se adapta a dispositivos móviles reduciendo el tamaño del logo y los iconos.

---

### 🔹 Footer

El Footer es un componente estático que aparece en todas las páginas de la aplicación.

**Características principales:**

- **Columnas informativas**: Enlaces a secciones como "Sobre nosotros", "Contactos", "Preguntas frecuentes", etc.
- **Redes sociales**: Iconos interactivos de Instagram, Twitter, Facebook, YouTube, Pinterest y TikTok
- **Efectos hover**: Los textos e iconos tienen transiciones suaves al pasar el cursor

**Comportamiento responsive**: En dispositivos móviles, las columnas se apilan verticalmente y se centran.

---

### 🔹 ThemeToggle

Componente para alternar entre modo claro y modo oscuro.

**Características principales:**

- Persiste la preferencia en `localStorage`
- Icono dinámico:
  - 🌙 Luna: indica modo claro (cambiar a oscuro)
  - ☀️ Sol: indica modo oscuro (cambiar a claro)
- Aplica la clase `dark-mode` al `body` para cambiar los estilos globales

## 🏗️ Estructura Principal

### App.jsx
El componente principal de la aplicación que envuelve toda la estructura:

```jsx
import { HashRouter } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./routes/AppRoutes";
import './styles/darkmode.css';

function App() {
  return (
    <HashRouter>
      <Header />
      <AppRoutes />
      <Footer />
    </HashRouter>
  );
}

export default App;
```

## 🗺️ Estructura de Rutas

El sistema de enrutamiento está definido en `AppRoutes.jsx` y utiliza React Router para manejar la navegación entre las diferentes páginas de la aplicación.

### 📋 Tabla de Rutas

| Ruta | Componente | Descripción | Acceso |
|------|------------|-------------|--------|
| `/` | `Home` | Página de inicio | Público |
| `/hombre` | `SeccionHombres` | Tienda de ropa para hombre | Público |
| `/mujer` | `SeccionMujer` | Tienda de ropa para mujer | Público |
| `/login` | `InicioSesion` | Página de inicio de sesión | Público |
| `/registro` | `Registro` | Página de registro de usuarios | Público |
| `/usuario` | `Usuario` | Panel de usuario | USER |
| `/usuario/datos` | `DatosUsuario` | Editar datos personales | USER |
| `/usuario/menuDatos` | `MenuDatosUsuario` | Menú principal del usuario | USER |
| `/admin/menu` | `MenuDatosAdmin` | Panel de administración | ADMIN |
| `/producto/:id` | `Producto` | Detalle de producto | Público |
| `/carrito` | `Carrito` | Carrito de compras | USER / ADMIN |

## 🌐 Configuración de Axios

La comunicación entre el frontend y el backend se realiza mediante una instancia personalizada de **Axios**, configurada para centralizar las peticiones HTTP hacia la API de UrbanLeather.

### 🔹 Configuración base

La instancia utiliza como URL principal del backend:

```javascript
https://urbanleather-production.up.railway.app
```

De esta forma, todas las peticiones realizadas desde la aplicación utilizan automáticamente esta dirección como punto de acceso a la API.

---

### 🔹 Interceptor de Peticiones (Request)

Antes de enviar cualquier petición, Axios verifica si existe un token JWT almacenado en `localStorage`.

Si el usuario está autenticado, el token se añade automáticamente al encabezado:

```http
Authorization: Bearer <token>
```

Esto evita tener que incluir manualmente el token en cada petición protegida.

---

### 🔹 Interceptor de Respuestas (Response)

La aplicación controla automáticamente los errores de autenticación.

Cuando el backend devuelve un código:

```http
401 Unauthorized
```

se considera que la sesión ya no es válida y se eliminan los datos de autenticación almacenados en el navegador:

- `token`
- `isLogged`
- `role`

Esto garantiza que el usuario no permanezca autenticado con un token expirado o inválido.

---

### 🔹 Organización de la API

Las peticiones se agrupan por módulos para mantener el código organizado y facilitar su mantenimiento:

- **authApi** → autenticación y registro.
- **usuarioApi** → gestión de usuarios.
- **direccionApi** → gestión de direcciones.
- **productoApi** → gestión de productos.
- **categoriaApi** → gestión de categorías.
- **tallaApi** → gestión de tallas y stock.
- **carritoApi** → gestión del carrito de compra.
- **compraApi** → gestión de compras y pedidos.

Este enfoque permite reutilizar la lógica de acceso a datos y mantener una separación clara entre la interfaz de usuario y las llamadas al backend.

---
## 📄 Páginas Principales

### 🏠 Home (Página de Inicio)

La página de inicio es la pantalla principal de la aplicación que permite a los usuarios navegar hacia las diferentes secciones de la tienda.

**Características principales:**

- **Navegación por género**: Enlaces directos a las secciones de HOMBRE y MUJER
- **Banner principal**: Imagen destacada que ocupa el 50% de la altura de la pantalla
- **Diseño minimalista**: Enfoque en la navegación visual

## 🔐 Inicio de Sesión (Login)

El componente `InicioSesion` gestiona la autenticación del usuario en la aplicación. Permite iniciar sesión, almacenar el token, obtener el perfil del usuario y redirigirlo a la pantalla principal.

---

### 📄 Archivo
`InicioSesion.jsx`

---

## ⚙️ Funcionalidades

- Gestión del formulario de login (`username`, `password`)
- Sistema de notificaciones (success, error, info)
- Autenticación contra la API
- Obtención del perfil del usuario autenticado
- Almacenamiento de datos en `localStorage`
- Redirección tras login exitoso

---
## 📝 Registro de Usuario

El componente `Registro` gestiona la creación de nuevas cuentas dentro de la aplicación. Permite al usuario introducir sus datos personales, validar la información y enviar la solicitud al backend para crear una nueva cuenta.

---

### 📄 Archivo
`Registro.jsx`

---

## ⚙️ Funcionalidad general

Este componente permite:

- Registrar nuevos usuarios en el sistema
- Gestionar el estado del formulario
- Mostrar notificaciones de éxito y error
- Enviar datos al endpoint `/register`
- Redirigir al usuario tras un registro exitoso

---
## 🧥 Sección Hombres

El componente `SeccionHombres` muestra todos los productos pertenecientes a la categoría **Hombre**. Incluye carga de datos desde el backend, filtrado en tiempo real y navegación al detalle del producto.

---

### 📄 Archivo
`SeccionHombres.jsx`

---

## ⚙️ Funcionalidad general

Este componente permite:

- Obtener productos desde el backend
- Filtrar productos por categoría "Hombre"
- Aplicar filtro de búsqueda desde la URL
- Mostrar estado de carga
- Navegar al detalle de producto
- Manejar acceso con o sin autenticación

---
## 👗 Sección Mujer

El componente `SeccionMujer` muestra todos los productos pertenecientes a la categoría **Mujer**. Incluye carga de datos desde el backend, filtrado por URL, búsqueda en tiempo real y navegación al detalle del producto.

---

### 📄 Archivo
`SeccionMujer.jsx`

---

## ⚙️ Funcionalidad general

Este componente permite:

- Obtener productos desde el backend
- Filtrar productos por categoría "Mujer"
- Aplicar filtro de búsqueda desde la URL
- Mostrar estado de carga
- Navegar al detalle de producto
- Soportar usuarios autenticados y no autenticados

---
## 👕 Detalle de Producto

El componente `Producto` muestra la información completa de un producto seleccionado, permite elegir talla y añadir el artículo al carrito de compra.

---

### 📄 Archivo
`Producto.jsx`

---

## ⚙️ Funcionalidad general

Este componente permite:

- Cargar un producto por ID desde el backend
- Mostrar información detallada del producto
- Seleccionar talla disponible
- Añadir producto al carrito
- Gestionar autenticación (token JWT)
- Manejar errores y estados de carga
- Mostrar notificaciones al usuario

---
## 🛒 Carrito de Compras

El componente `Carrito` gestiona toda la lógica del carrito de la compra del usuario, incluyendo la visualización de productos, eliminación de items, vaciado del carrito y proceso de compra.

---

### 📄 Archivo
`Carrito.jsx`

---

## ⚙️ Funcionalidad general

Este componente permite:

- Ver el carrito del usuario autenticado
- Eliminar productos del carrito
- Vaciar completamente el carrito (con confirmación)
- Realizar una compra (checkout)
- Mostrar estados de carga y autenticación
- Gestionar notificaciones al usuario

---
## 👤 Perfil de Usuario

El componente `Usuario` muestra la sección principal del perfil del usuario, permitiendo acceder a opciones de cuenta, datos personales y cerrar sesión.

---

### 📄 Archivo
`Usuario.jsx`

---

## ⚙️ Funcionalidad general

Este componente permite:

- Obtener los datos del usuario autenticado
- Mostrar un menú de opciones de cuenta
- Redirigir según el rol del usuario (USER / ADMIN)
- Cerrar sesión eliminando el token
- Navegar a diferentes secciones del perfil

---
## 👤 Datos de Usuario

El componente `DatosUsuario` muestra la información personal del usuario autenticado junto con su dirección (si existe).

---

### 📄 Archivo
`DatosUsuario.jsx`

---

## ⚙️ Funcionalidad general

Este componente permite:

- Obtener datos del usuario autenticado
- Obtener la dirección del usuario (si existe)
- Mostrar información personal completa
- Manejar usuarios sin dirección registrada
- Gestionar carga inicial de datos

---
# 👤 Menú de Usuario (MenuDatosUsuario)

El componente `MenuDatosUsuario` es el **panel principal de gestión del usuario autenticado**. Permite al usuario administrar su perfil, dirección, compras y eliminar su cuenta, todo desde una única interfaz.

---

## 📄 Archivo
`MenuDatosUsuario.jsx`

---

## 🎯 Propósito

Este componente centraliza todas las acciones del usuario:

- Gestión de perfil personal
- Gestión de dirección
- Visualización de compras
- Eliminación de cuenta
- Cierre de sesión
- Navegación interna del área de usuario

---
# 🛠️ Panel de Administración (MenuDatosAdmin)

El componente `MenuDatosAdmin` es el **panel principal de control del administrador**. Permite gestionar usuarios, productos, stock y compras desde una interfaz centralizada.

---

## 📄 Archivo
`MenuDatosAdmin.jsx`

---

## 🎯 Propósito

Este componente permite al administrador:

- Gestionar usuarios (ver, editar, eliminar)
- Gestionar productos (crear, buscar, modificar)
- Controlar stock por tallas
- Consultar compras de usuarios
- Administrar toda la tienda desde un único panel

---
# 📘 DOCUMENTACIÓN DEL PROYECTO: URBANLEATHER

---

## 📑 Índice

1. Resumen
2. Funcionalidades Principales
3. Instalación y Preparación (backend)
4. Instalación y Preparación (frontend)
5. Guía de Estilos y Prototipado
6. Diseño
7. Desarrollo
8. Estilos
9. Accesibilidad y SEO
10. Pruebas
11. Docker
12. Despliegue Web
13. Guía de desarrollo (tutorial)
14. Despliegue en Local
15. Conclusiones

---

## 🔗 Documentación completa

https://drive.google.com/file/d/1tIRmXvSTHyaO1wKxMWqsLVCQVOt51vPq/view?usp=sharing
