import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm/LoginForm";
import RegisterForm from "../components/RegisterForm/RegisterForm";
import "./AuthPage.css";

export default function AuthPage({ onLogin }) {
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    onLogin?.(userData);
    setMessage({ type: "success", text: "Sesión iniciada correctamente." });

    setTimeout(() => {
      if (userData.roles?.includes("ADMIN")) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/home";
      }
    }, 500);
  };

  const handleRegister = (userData) => {
    onLogin?.(userData);
    setMessage({
      type: "success",
      text: "¡Registro exitoso! Bienvenido.",
    });

    setTimeout(() => {
      window.location.href = "/home";
    }, 500);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Level UP Gamer</h1>
            <p>Tu tienda gaming favorita</p>
          </div>

          {message && (
            <div className={`alert alert-${message.type}`}>{message.text}</div>
          )}

          <div className="auth-tabs">
            <button
              className={`tab-button ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Iniciar Sesión
            </button>
            <button
              className={`tab-button ${
                activeTab === "register" ? "active" : ""
              }`}
              onClick={() => setActiveTab("register")}
            >
              Registrarse
            </button>
          </div>

          <div className="auth-content">
            {activeTab === "login" ? (
              <LoginForm onSuccess={handleLogin} />
            ) : (
              <RegisterForm onSuccess={handleRegister} />
            )}
          </div>

          <div className="auth-footer">
            <p>
              ¿Olvidaste tu contraseña?{" "}
              <a href="/reset-password">Recupérala aquí</a>
            </p>
          </div>
        </div>

        <div className="auth-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>
    </div>
  );
}
