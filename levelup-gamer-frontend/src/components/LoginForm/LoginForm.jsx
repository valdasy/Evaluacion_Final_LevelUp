// src/components/LoginForm/LoginForm.jsx
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { validateEmail } from "../../utils/validators";
import authService from "../../services/authService";

export default function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!validateEmail(form.email)) e.email = "Email inválido";
    if (!form.password) e.password = "Contraseña requerida";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await authService.login(form.email, form.password);

      // Llamar onSuccess con los datos del usuario
      onSuccess?.(data);
    } catch (err) {
      const msg =
        typeof err === "string"
          ? err
          : err.message || "Error al iniciar sesión";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="alert alert-danger mb-3">{serverError}</div>
      )}

      <Form.Group className="mb-3">
        <Form.Label htmlFor="email">Email</Form.Label>
        <Form.Control
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          isInvalid={!!errors.email}
          placeholder="tu@correo.com"
        />
        <Form.Control.Feedback type="invalid">
          {errors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="password">Contraseña</Form.Label>
        <Form.Control
          id="password"
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          isInvalid={!!errors.password}
          placeholder="********"
        />
        <Form.Control.Feedback type="invalid">
          {errors.password}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-grid">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Iniciando sesión..." : "Ingresar"}
        </Button>
      </div>
    </Form>
  );
}
