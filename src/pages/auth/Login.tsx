import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { login } from "../../utils/auth.ts"; // Adjust path as necessary

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize the navigation hook

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      console.log("User logged in:", user);
      alert("Login successful!");
      navigate("/"); // Redirect to /home after login
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error.message);
        alert(error.message);
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>
        <p className="text-center text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
