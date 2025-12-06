import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import authService from '../services/authService';
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProductos: 0,
    productosDestacados: 0,
    totalCategorias: 0,
    usuariosActivos: 0,
    ventasHoy: 0,
    ventasMes: 0
  });

  useEffect(() => {
    // Verificar que sea admin (comentado temporalmente)
    // if (!authService.hasRole('ADMIN')) {
    //   navigate('/home');
    //   return;
    // }

    // Cargar estadísticas (DEMO)
    setStats({
      totalProductos: 42,
      productosDestacados: 8,
      totalCategorias: 5,
      usuariosActivos: 127,
      ventasHoy: 15,
      ventasMes: 342
    });
  }, [navigate]);

  const user = authService.getCurrentUser();

  return (
    <div className="admin-page">
      <Header />
      
      <div className="admin-container">
        <aside className="admin-sidebar">
          <div className="sidebar-header">
            <h2>🎮 Admin Panel</h2>
          </div>
          
          <nav className="sidebar-nav">
            <button 
              className="nav-item active"
              onClick={() => navigate('/admin')}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </button>
            <button 
              className="nav-item"
              onClick={() => navigate('/admin/products')}
            >
              <span className="nav-icon">🎮</span>
              Productos
            </button>
            <button 
              className="nav-item"
              onClick={() => navigate('/admin/categories')}
            >
              <span className="nav-icon">📁</span>
              Categorías
            </button>
            <button 
              className="nav-item"
              onClick={() => navigate('/admin/orders')}
            >
              <span className="nav-icon">🛒</span>
              Pedidos
            </button>
            <button 
              className="nav-item"
              onClick={() => navigate('/admin/users')}
            >
              <span className="nav-icon">👥</span>
              Usuarios
            </button>
            <button 
              className="nav-item"
              onClick={() => navigate('/admin/reports')}
            >
              <span className="nav-icon">📈</span>
              Reportes
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="admin-user-info">
              <div className="admin-avatar">
                {user?.nombreCompleto?.charAt(0) || 'A'}
              </div>
              <div className="admin-user-details">
                <strong>{user?.nombreCompleto || 'Admin Demo'}</strong>
                <span>Administrador</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="admin-main-content">
          <div className="dashboard-header">
            <div>
              <h1>Dashboard</h1>
              <p>Bienvenido de vuelta, {user?.nombreCompleto || 'Admin'} 👋</p>
            </div>
            <button className="btn-refresh" onClick={() => window.location.reload()}>
              🔄 Actualizar
            </button>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card purple">
              <div className="stat-icon">🛍️</div>
              <div className="stat-content">
                <span className="stat-label">Ventas Hoy</span>
                <span className="stat-value">{stats.ventasHoy}</span>
                <span className="stat-trend positive">↑ 12% vs ayer</span>
              </div>
            </div>

            <div className="stat-card blue">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <span className="stat-label">Ventas del Mes</span>
                <span className="stat-value">{stats.ventasMes}</span>
                <span className="stat-trend positive">↑ 8% vs mes anterior</span>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-icon">🎮</div>
              <div className="stat-content">
                <span className="stat-label">Total Productos</span>
                <span className="stat-value">{stats.totalProductos}</span>
                <span className="stat-trend neutral">{stats.productosDestacados} destacados</span>
              </div>
            </div>

            <div className="stat-card orange">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <span className="stat-label">Usuarios Activos</span>
                <span className="stat-value">{stats.usuariosActivos}</span>
                <span className="stat-trend positive">↑ 5 nuevos hoy</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Acciones Rápidas</h2>
            <div className="actions-grid">
              <div className="action-card" onClick={() => navigate('/admin/products')}>
                <div className="action-icon blue">🎮</div>
                <h3>Gestionar Productos</h3>
                <p>Ver, crear y editar productos</p>
                <span className="action-badge">{stats.totalProductos} items</span>
              </div>

              <div className="action-card" onClick={() => navigate('/admin/categories')}>
                <div className="action-icon green">📁</div>
                <h3>Categorías</h3>
                <p>Organizar productos por categoría</p>
                <span className="action-badge">{stats.totalCategorias} categorías</span>
              </div>

              <div className="action-card" onClick={() => navigate('/admin/orders')}>
                <div className="action-icon purple">🛒</div>
                <h3>Pedidos</h3>
                <p>Gestión y seguimiento de compras</p>
                <span className="action-badge">{stats.ventasHoy} pendientes</span>
              </div>

              <div className="action-card" onClick={() => navigate('/admin/users')}>
                <div className="action-icon orange">👥</div>
                <h3>Usuarios</h3>
                <p>Administrar cuentas y roles</p>
                <span className="action-badge">{stats.usuariosActivos} usuarios</span>
              </div>

              <div className="action-card" onClick={() => navigate('/admin/reports')}>
                <div className="action-icon red">📈</div>
                <h3>Reportes</h3>
                <p>Análisis y estadísticas</p>
                <span className="action-badge">Ver reportes</span>
              </div>

              <div className="action-card" onClick={() => navigate('/home')}>
                <div className="action-icon gray">🌐</div>
                <h3>Ver Tienda</h3>
                <p>Vista de cliente</p>
                <span className="action-badge">Ir a tienda</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <h2>Actividad Reciente</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon blue">🛍️</div>
                <div className="activity-content">
                  <strong>Nueva venta realizada</strong>
                  <span>PlayStation 5 - $599.990</span>
                </div>
                <span className="activity-time">Hace 5 min</span>
              </div>

              <div className="activity-item">
                <div className="activity-icon green">✅</div>
                <div className="activity-content">
                  <strong>Producto actualizado</strong>
                  <span>Xbox Series X - Stock actualizado</span>
                </div>
                <span className="activity-time">Hace 15 min</span>
              </div>

              <div className="activity-item">
                <div className="activity-icon purple">👤</div>
                <div className="activity-content">
                  <strong>Nuevo usuario registrado</strong>
                  <span>usuario@email.com</span>
                </div>
                <span className="activity-time">Hace 1 hora</span>
              </div>

              <div className="activity-item">
                <div className="activity-icon orange">📦</div>
                <div className="activity-content">
                  <strong>Pedido enviado</strong>
                  <span>Orden #1234 - En camino</span>
                </div>
                <span className="activity-time">Hace 2 horas</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminPage;
