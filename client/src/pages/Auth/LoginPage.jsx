import React, { useState } from "react";
import { useAuth } from "@contexts/AuthContext";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      // Use demo credentials
      await login("demo@example.com", "password123");
    } catch (error) {
      console.error("Demo login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: "2rem", 
      maxWidth: "400px", 
      margin: "0 auto",
      textAlign: "center"
    }}>
      <h2>Health AI Agent Login</h2>
      
      <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px"
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px"
            }}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={handleDemoLogin}
          disabled={isLoading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1
          }}
        >
          Demo Login
        </button>
      </div>
      
      <div style={{ marginTop: "1rem" }}>
        <p style={{ fontSize: "14px", color: "#666" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#007bff", textDecoration: "none" }}>
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
} 