import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './RegisterForm.css'; // Asegúrate de tener este CSS o bórralo

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    username: '', // Muchos backends piden esto
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      // ✅ LIMPIEZA DE DATOS: Preparamos solo lo que Java quiere
      const datosParaEnviar = {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        username: formData.username || formData.email.split('@')[0] // Generar username si está vacío
      };

      console.log("Enviando al backend:", datosParaEnviar); // Para depurar

      await authService.register(datosParaEnviar);
      
      // Si pasa, redirigimos al login
      alert("¡Cuenta creada con éxito! Ahora inicia sesión.");
      navigate('/auth'); // O donde tengas el login
    } catch (err) {
      console.error("Error de registro:", err);
      // Intentamos mostrar el mensaje exacto del servidor si existe
      setError(err.response?.data || "Error al registrar. Verifica los datos.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      {error && <div className="alert-error">{error}</div>}
      
      <div className="form-group">
        <label>Nombre Completo</label>
        <input 
          type="text" 
          name="nombre" 
          value={formData.nombre} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Nombre de Usuario</label>
        <input 
          type="text" 
          name="username" 
          value={formData.username} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Contraseña</label>
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          minLength="6"
        />
      </div>

      <div className="form-group">
        <label>Confirmar Contraseña</label>
        <input 
          type="password" 
          name="confirmPassword" 
          value={formData.confirmPassword} 
          onChange={handleChange} 
          required 
        />
      </div>

      <button type="submit" className="btn-submit">Registrarse</button>
    </form>
  );
};

export default RegisterForm;