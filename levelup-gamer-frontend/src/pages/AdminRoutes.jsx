// src/pages/AdminRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './AdminPage';
import AdminProductsPage from './AdminProductsPage';

export default function AdminRoutes(props) {
return (
<Routes>
    <Route path="/" element={<AdminPage {...props} />} />
    <Route path="/products" element={<AdminProductsPage {...props} />} />
    <Route path="/categories" element={<div className="p-4">Categorías (en construcción)</div>} />
    <Route path="/users" element={<div className="p-4">Usuarios (en construcción)</div>} />
    <Route path="/reports" element={<div className="p-4">Reportes (en construcción)</div>} />
    <Route path="*" element={<Navigate to="/admin" replace />} />
</Routes>
);
}
