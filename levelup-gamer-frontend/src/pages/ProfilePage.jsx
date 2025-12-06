import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import authService from "../services/authService";
import { validateEmail } from "../utils/validators";
import "./ProfilePage.css";

export default function ProfilePage({ onLogout }) {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setForm({
        nombre: currentUser.nombreCompleto?.split(" ")[0] || "",
        apellido:
          currentUser.nombreCompleto?.split(" ").slice(1).join(" ") || "",
        email: currentUser.email || "",
        telefono: currentUser.telefono || "",
        direccion: currentUser.direccion || "",
      });
    }
    setLoading(false);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Nombre requerido";
    if (!form.apellido.trim()) e.apellido = "Apellido requerido";
    if (!validateEmail(form.email)) e.email = "Email inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    if (!validate()) return;

    try {
      const updatedUser = {
        ...user,
        nombreCompleto: `${form.nombre} ${form.apellido}`,
        telefono: form.telefono,
        direccion: form.direccion,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSaved(true);
      setEditing(false);

      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      setErrors({ general: "Error al actualizar el perfil" });
    }
  };

  const handleCancel = () => {
    loadUserData();
    setEditing(false);
    setErrors({});
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Header onLogout={onLogout} />
        <Container className="my-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando perfil...</p>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <Header onLogout={onLogout} />
        <Container className="my-5">
          <Alert variant="warning">
            <Alert.Heading>Acceso restringido</Alert.Heading>
            <p>Debes iniciar sesión para ver tu perfil.</p>
            <hr />
            <div className="d-flex gap-2">
              <Button as={Link} to="/auth" variant="warning">
                Iniciar sesión
              </Button>
              <Button as={Link} to="/home" variant="outline-secondary">
                Volver al inicio
              </Button>
            </div>
          </Alert>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Header onLogout={onLogout} />

      <div className="profile-hero">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center gap-3">
                <div className="profile-avatar">
                  <div className="avatar-circle">
                    {form.nombre.charAt(0)}
                    {form.apellido.charAt(0)}
                  </div>
                </div>
                <div>
                  <h2 className="mb-1">
                    {form.nombre} {form.apellido}
                  </h2>
                  <p className="text-muted mb-0">
                    <i className="bi bi-envelope me-2"></i>
                    {user.email}
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              {user.roles && user.roles.length > 0 && (
                <div className="mb-2">
                  {user.roles.map((role) => (
                    <Badge
                      key={role}
                      bg={role === "ADMIN" ? "danger" : "primary"}
                      className="me-1"
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              )}
              {!editing && (
                <Button
                  variant="outline-light"
                  onClick={() => setEditing(true)}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Editar perfil
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="my-5">
        {saved && (
          <Alert variant="success" dismissible onClose={() => setSaved(false)}>
            <i className="bi bi-check-circle me-2"></i>
            ¡Perfil actualizado correctamente!
          </Alert>
        )}
        {errors.general && (
          <Alert variant="danger" dismissible onClose={() => setErrors({})}>
            <i className="bi bi-exclamation-triangle me-2"></i>
            {errors.general}
          </Alert>
        )}

        <Row className="g-4">
          <Col lg={8}>
            <Card className="profile-card shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">
                    <i className="bi bi-person-circle me-2 text-primary"></i>
                    Información personal
                  </h4>
                  {editing && <Badge bg="info">Modo edición</Badge>}
                </div>

                <Form onSubmit={onSubmit} noValidate>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-person me-2"></i>
                          Nombre
                        </Form.Label>
                        <Form.Control
                          name="nombre"
                          value={form.nombre}
                          onChange={onChange}
                          isInvalid={!!errors.nombre}
                          placeholder="Ej: Juan"
                          disabled={!editing}
                          className="profile-input"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.nombre}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-person me-2"></i>
                          Apellido
                        </Form.Label>
                        <Form.Control
                          name="apellido"
                          value={form.apellido}
                          onChange={onChange}
                          isInvalid={!!errors.apellido}
                          placeholder="Pérez"
                          disabled={!editing}
                          className="profile-input"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.apellido}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-envelope me-2"></i>
                          Email
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={onChange}
                          isInvalid={!!errors.email}
                          placeholder="tu@correo.com"
                          disabled
                          className="profile-input"
                        />
                        <Form.Text className="text-muted">
                          <i className="bi bi-lock me-1"></i>
                          El email no se puede modificar
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-telephone me-2"></i>
                          Teléfono
                        </Form.Label>
                        <Form.Control
                          name="telefono"
                          value={form.telefono}
                          onChange={onChange}
                          placeholder="+56 9 1234 5678"
                          disabled={!editing}
                          className="profile-input"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-geo-alt me-2"></i>
                          Dirección
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="direccion"
                          value={form.direccion}
                          onChange={onChange}
                          placeholder="Calle, número, ciudad, región"
                          disabled={!editing}
                          className="profile-input"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {editing && (
                    <div className="d-flex gap-2">
                      <Button type="submit" variant="primary" className="px-4">
                        <i className="bi bi-check-lg me-2"></i>
                        Guardar cambios
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={handleCancel}
                        className="px-4"
                      >
                        <i className="bi bi-x-lg me-2"></i>
                        Cancelar
                      </Button>
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="profile-card shadow-sm mb-4">
              <Card.Body className="p-4">
                <h5 className="mb-3">
                  <i className="bi bi-star me-2 text-warning"></i>
                  Estadísticas
                </h5>
                <div className="stat-item">
                  <div className="stat-icon">
                    <i className="bi bi-bag-check"></i>
                  </div>
                  <div>
                    <div className="stat-label">Pedidos realizados</div>
                    <div className="stat-value">0</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">
                    <i className="bi bi-heart"></i>
                  </div>
                  <div>
                    <div className="stat-label">Favoritos</div>
                    <div className="stat-value">0</div>
                  </div>
                </div>
                <div className="stat-item mb-0">
                  <div className="stat-icon">
                    <i className="bi bi-trophy"></i>
                  </div>
                  <div>
                    <div className="stat-label">Puntos Level UP</div>
                    <div className="stat-value">0</div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="profile-card shadow-sm">
              <Card.Body className="p-4">
                <h5 className="mb-3">
                  <i className="bi bi-lightning me-2 text-primary"></i>
                  Acciones rápidas
                </h5>
                <div className="d-grid gap-2">
                  <Button
                    as={Link}
                    to="/orders"
                    variant="outline-primary"
                    className="quick-action-btn"
                  >
                    <i className="bi bi-receipt me-2"></i>
                    Mis pedidos
                  </Button>
                  <Button
                    as={Link}
                    to="/products"
                    variant="outline-primary"
                    className="quick-action-btn"
                  >
                    <i className="bi bi-shop me-2"></i>
                    Ver catálogo
                  </Button>
                  <Button
                    as={Link}
                    to="/cart"
                    variant="outline-primary"
                    className="quick-action-btn"
                  >
                    <i className="bi bi-cart me-2"></i>
                    Mi carrito
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
}
