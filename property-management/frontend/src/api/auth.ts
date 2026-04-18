/*// src/api/auth.ts
const API_URL = "http://localhost:8080/api/auth";

export const auth = {
  async login(credentials: { username: string; password: string }) {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    return res.json(); 
    // must return: { token: string, role: "ADMIN" | "USER" }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },

  isAdmin() {
    return localStorage.getItem("role") === "ADMIN";
  },
};
*/
// src/api/auth.ts
// Standardize this to the root URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const auth = {
  async login(credentials: { username: string; password: string }) {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      // It's helpful to see the status code if it fails
      throw new Error(`Login failed with status: ${res.status}`);
    }

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
    }

    return data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // Optional: redirect to login page
    window.location.href = "/login";
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },

  isAdmin() {
    return localStorage.getItem("role") === "ROLE_ADMIN" || localStorage.getItem("role") === "ADMIN";
  },

  token() {
    return localStorage.getItem("token");
  },
};