import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/api/auth";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          role: "ADMIN", // 👈 explicitly admin
        }),
      });

      if (!res.ok) throw new Error("Signup failed");

      navigate("/login");
    } catch (err) {
      setError("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-80 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center">Admin Signup</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border px-3 py-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-[#C9A24D] text-black py-2 rounded hover:bg-[#B79424]"
        >
          Create Admin Account
        </button>
      </form>
    </div>
  );
}
