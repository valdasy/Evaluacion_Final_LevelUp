import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import {
  validateEmail,
  isOver18,
  validatePassword,
} from "../../utils/validators";
import authService from "../../services/authService";

export default function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nombre requerido";
    if (!validateEmail(form.email)) e.email = "Email inválido";
    if (!validatePassword(form.password)) e.password = "Contraseña inválida";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Las contraseñas no coinciden";
    if (!isOver18(form.birthDate)) e.birthDate = "Debes ser mayor de 18 años";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      // Separar nombre y apellido del campo name
      const nombreCompleto = form.name.trim().split(" ");
      const nombre = nombreCompleto[0] || "";
      const apellido = nombreCompleto.slice(1).join(" ") || "";

      const registroData = {
        nombre: nombre,
        apellido: apellido,
        email: form.email,
        password: form.password,
        fechaNacimiento: form.birthDate,
        telefono: "",
        direccion: "",
      };

      const data = await authService.register(registroData);

      // Notificar al padre (AuthPage) que el registro fue exitoso
      onSuccess?.(data);
    } catch (err) {
      const msg =
        typeof err === "string" ? err : err.message || "Error al registrarse";
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
        <Form.Label htmlFor="name">Nombre Completo</Form.Label>
        <Form.Control
          id="name"
          name="name"
          value={form.name}
          onChange={onChange}
          isInvalid={!!errors.name}
          placeholder="Ej: Juan Pérez"
        />
        <Form.Control.Feedback type="invalid">
          {errors.name}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="email">Email</Form.Label>
        <Form.Control
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          isInvalid={!!errors.email}
          placeholder="tu@email.com"
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
          placeholder="Mínimo 6 caracteres"
        />
        <Form.Control.Feedback type="invalid">
          {errors.password}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="confirmPassword">Confirmar Contraseña</Form.Label>
        <Form.Control
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={onChange}
          isInvalid={!!errors.confirmPassword}
          placeholder="Repetir contraseña"
        />
        <Form.Control.Feedback type="invalid">
          {errors.confirmPassword}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="birthDate">Fecha de Nacimiento</Form.Label>
        <Form.Control
          id="birthDate"
          type="date"
          name="birthDate"
          value={form.birthDate}
          onChange={onChange}
          isInvalid={!!errors.birthDate}
        />
        <Form.Control.Feedback type="invalid">
          {errors.birthDate}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-grid">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </Button>
      </div>
    </Form>
  );
}
