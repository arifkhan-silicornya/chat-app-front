"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function register(e) {
    e.preventDefault();
    const res = await fetch("http://localhost:4000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, firstName }),
    });
    const j = await res.json();
    if (j.ok) alert("Registered! Now log in.");
    else alert(j.error || "Error");
  }

  async function login(e) {
    e.preventDefault();
    const res = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const j = await res.json();
    if (j.ok) {
      localStorage.setItem("chat_token", j.token);
      localStorage.setItem("chat_user", JSON.stringify(j.user));
      router.push("/chat");
    } else {
      alert(j.error || "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-gray-900 text-gray-100 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        Simple Chat (Demo)
      </h1>

      {/* Login Form */}
      <form onSubmit={login} className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Login</h2>
        <input
          className="w-full mb-4 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-4 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>

      <hr className="my-6 border-gray-700" />

      {/* Registration Form */}
      <form onSubmit={register}>
        <h2 className="text-lg font-semibold mb-4">Register</h2>
        <input
          className="w-full mb-4 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="w-full mb-4 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-4 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
