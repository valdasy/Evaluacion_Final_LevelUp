import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

// ✅ Header ahora recibe 'user' y 'cartItemsCount' como props
const Header = ({ user, cartItemsCount = 0, onLogout }) => {
  // ✅ La autenticación y el rol se determinan desde la prop 'user'
  const isAuthenticated = !!user;
  const isAdmin = user?.roles?.includes("ADMIN");

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback por si onLogout no se pasa
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/home";
    }
  };

  const displayName = user?.nombreCompleto?.trim() || user?.email || "Usuario";

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/home" className="logo">
          <h1>Level UP Gamer</h1>
        </Link>

        <nav className="nav-menu">
          <Link to="/home">Inicio</Link>
          <Link to="/products">Productos</Link>

          {isAuthenticated ? (
            <>
              <Link to="/cart" className="cart-link">
                🛒 Carrito
                {/* ✅ Usa la prop 'cartItemsCount' para mostrar la cantidad */}
                {cartItemsCount > 0 && (
                  <span className="cart-badge">{cartItemsCount}</span>
                )}
              </Link>

              <Link to="/profile">Mi Perfil</Link>

              {/* ✅ Usa la variable 'isAdmin' para mostrar el enlace */}
              {isAdmin && <Link to="/admin">Admin LevelUp</Link>}

              <div className="user-section">
                <span className="user-name">{displayName}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Cerrar Sesión
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/auth" className="btn-login-link">
                Iniciar Sesión
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
