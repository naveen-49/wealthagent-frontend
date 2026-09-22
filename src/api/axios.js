
import axios from "axios";

const api = axios.create({
  baseURL: "https://nexgile-wealthagentstats-3.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      const message = error.response?.data?.msg || "";

      if (
        message.toLowerCase().includes("expired") ||
        message.toLowerCase().includes("signature")
      ) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;

