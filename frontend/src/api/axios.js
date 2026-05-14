import axios from "axios";

/*const api = axios.create({
  baseURL: "http://localhost:8081",
});*/

const api = axios.create({
  baseURL: "https://urbanleather-production.up.railway.app",
});

// =========================
// INTERCEPTOR REQUEST JWT
// =========================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (
    token &&
    token !== "null" &&
    token !== "undefined"
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =========================
// INTERCEPTOR RESPONSE
// =========================
api.interceptors.response.use(
  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      // token inválido o expirado
      localStorage.removeItem("token");

      // redirigir login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;