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

    const data = await res.json();

    // ✅ STORE HERE
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    return data;
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

  token() {
    return localStorage.getItem("token");
  },
};
