import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isDuocEmail, validateEmail } from "../utils/validators";
import { useCarrito } from "../context/CarritoContext";
import authService from "../services/authService";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./CheckoutPage.css";

export default function CheckoutPage({ onLogout }) {
  const navigate = useNavigate();
  const { carrito, loading, cargarCarrito, obtenerCantidadTotal } =
    useCarrito();
  const user = authService.getCurrentUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartItemsCount = obtenerCantidadTotal();

  // Cargar carrito si no está
  useEffect(() => {
    if (!carrito) {
      cargarCarrito();
    }
  }, [carrito, cargarCarrito]);

  // Si no hay items y no está enviando, volver al carrito
  useEffect(() => {
    const items = carrito?.items || [];
    if (!loading && !isSubmitting && items.length === 0) {
      navigate("/cart");
    }
  }, [carrito, loading, isSubmitting, navigate]);

  const items = carrito?.items || [];

  const { subtotal, discount, total } = useMemo(() => {
    const sub =
      items.reduce(
        (acc, it) =>
          acc + Number(it.subtotal || it.precioUnitario * it.cantidad || 0),
        0
      ) || 0;
    const duoc = user?.email && isDuocEmail(user.email) ? 0.2 : 0;
    const disc = Math.round(sub * duoc);
    return { subtotal: sub, discount: disc, total: sub - disc };
  }, [items, user]);

  // ✅ CORRECCIÓN: Inicializar el estado UNA SOLA VEZ con los datos del usuario
  const [form, setForm] = useState(() => {
    if (user) {
      return {
        name: user.nombreCompleto || "",
        email: user.email || "",
        phone: user.telefono || "",
        addressLine: user.direccion || "",
        number: "",
        apt: "",
        city: "",
        region: "",
        zip: "",
        notes: "",
        saveToProfile: true,
      };
    }

    return {
      name: "",
      email: "",
      phone: "",
      addressLine: "",
      number: "",
      apt: "",
      city: "",
      region: "",
      zip: "",
      notes: "",
      saveToProfile: true,
    };
  });

  // ✅ ELIMINADO: El useEffect que causaba el problema
  // useEffect(() => {
  //   if (user) {
  //     setForm((f) => ({
  //       ...f,
  //       name: user.nombreCompleto || "",
  //       email: user.email || "",
  //       phone: user.telefono || "",
  //       addressLine: user.direccion || "",
  //     }));
  //   }
  // }, [user]);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const name = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    // Limpiar error al escribir
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const validatePhone = (value) => value.replace(/\D/g, "").length >= 8;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nombre requerido";
    if (!validateEmail(form.email)) e.email = "Email inválido";
    if (!validatePhone(form.phone))
      e.phone = "Teléfono inválido (mínimo 8 dígitos)";
    if (!form.addressLine.trim()) e.addressLine = "Calle requerida";
    if (!form.number.trim()) e.number = "Número requerido";
    if (!form.city.trim()) e.city = "Ciudad requerida";
    if (!form.region.trim()) e.region = "Región requerida";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    const payload = {
      customer: { name: form.name, email: form.email, phone: form.phone },
      shippingAddress: {
        addressLine: form.addressLine,
        number: form.number,
        apt: form.apt,
        city: form.city,
        region: form.region,
        zip: form.zip,
        notes: form.notes,
      },
      cartItems: items,
      totals: { subtotal, discount, total },
      saveToProfile: !!user && form.saveToProfile,
    };

    // Simulación de envío
    console.log("Payload de checkout:", payload);
    setTimeout(() => {
      navigate("/order-success");
    }, 1500);
  };

  if (loading && !carrito) {
    return (
      <div className="checkout-page">
        <Header
          user={user}
          cartItemsCount={cartItemsCount}
          onLogout={onLogout}
        />
        <main className="checkout-loading">
          <div className="spinner"></div>
          <p>Cargando checkout...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Header user={user} cartItemsCount={cartItemsCount} onLogout={onLogout} />

      <main className="checkout-main">
        <div className="checkout-container">
          <div className="checkout-header-nav">
            <button className="btn-back" onClick={() => navigate("/cart")}>
              ← Volver al carrito
            </button>
            <h1>Finalizar Compra</h1>
          </div>

          <div className="checkout-grid">
            {/* Columna Izquierda: Formulario */}
            <div className="checkout-form-section">
              <div className="checkout-card">
                <h2 className="card-title">📍 Datos de Envío</h2>
                <form onSubmit={handleSubmit} noValidate>
                  {/* Datos Personales */}
                  <div className="form-section-title">
                    Información de contacto
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre completo</label>
                      <input
                        type="text"
                        name="name"
                        className={`form-input ${errors.name ? "error" : ""}`}
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ej: Juan Pérez"
                      />
                      {errors.name && (
                        <span className="error-msg">{errors.name}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        className={`form-input ${errors.email ? "error" : ""}`}
                        value={form.email}
                        onChange={handleChange}
                        placeholder="tu@correo.com"
                      />
                      {errors.email && (
                        <span className="error-msg">{errors.email}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Teléfono</label>
                      <input
                        type="tel"
                        name="phone"
                        className={`form-input ${errors.phone ? "error" : ""}`}
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+56 9 1234 5678"
                      />
                      {errors.phone && (
                        <span className="error-msg">{errors.phone}</span>
                      )}
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="form-section-title mt-4">
                    Dirección de entrega
                  </div>
                  <div className="form-row with-30">
                    <div className="form-group flex-70">
                      <label>Calle</label>
                      <input
                        type="text"
                        name="addressLine"
                        className={`form-input ${
                          errors.addressLine ? "error" : ""
                        }`}
                        value={form.addressLine}
                        onChange={handleChange}
                        placeholder="Ej: Av. Siempre Viva"
                      />
                      {errors.addressLine && (
                        <span className="error-msg">{errors.addressLine}</span>
                      )}
                    </div>
                    <div className="form-group flex-30">
                      <label>Número</label>
                      <input
                        type="text"
                        name="number"
                        className={`form-input ${errors.number ? "error" : ""}`}
                        value={form.number}
                        onChange={handleChange}
                        placeholder="123"
                      />
                      {errors.number && (
                        <span className="error-msg">{errors.number}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Depto / Casa (Opcional)</label>
                      <input
                        type="text"
                        name="apt"
                        className="form-input"
                        value={form.apt}
                        onChange={handleChange}
                        placeholder="Depto 402"
                      />
                    </div>
                    <div className="form-group">
                      <label>Ciudad</label>
                      <input
                        type="text"
                        name="city"
                        className={`form-input ${errors.city ? "error" : ""}`}
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Santiago"
                      />
                      {errors.city && (
                        <span className="error-msg">{errors.city}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Región</label>
                      <input
                        type="text"
                        name="region"
                        className={`form-input ${errors.region ? "error" : ""}`}
                        value={form.region}
                        onChange={handleChange}
                        placeholder="Metropolitana"
                      />
                      {errors.region && (
                        <span className="error-msg">{errors.region}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Código Postal (Opcional)</label>
                      <input
                        type="text"
                        name="zip"
                        className="form-input"
                        value={form.zip}
                        onChange={handleChange}
                        placeholder="1234567"
                      />
                    </div>
                  </div>

                  <div className="form-group mt-3">
                    <label>Instrucciones de entrega (Opcional)</label>
                    <textarea
                      name="notes"
                      className="form-input"
                      rows="2"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Dejar en conserjería, timbre malo, etc."
                    ></textarea>
                  </div>

                  {user && (
                    <div className="form-check mt-3">
                      <input
                        type="checkbox"
                        id="saveToProfile"
                        name="saveToProfile"
                        checked={form.saveToProfile}
                        onChange={handleChange}
                      />
                      <label htmlFor="saveToProfile">
                        Guardar esta dirección en mi perfil
                      </label>
                    </div>
                  )}

                  <div className="form-actions mt-4">
                    <button
                      type="submit"
                      className="btn-primary-large"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Procesando..." : "Confirmar y Pagar"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Columna Derecha: Resumen */}
            <div className="checkout-summary-section">
              <div className="checkout-summary-card">
                <h2 className="card-title">🛒 Resumen del Pedido</h2>

                <div className="summary-items-list">
                  {items.map((item) => (
                    <div key={item.id} className="summary-item">
                      <div className="summary-item-img">
                        <img
                          src={item.producto?.imagenUrl || "/placeholder.png"}
                          alt={item.producto?.nombre}
                          onError={(e) => (e.target.src = "/placeholder.png")}
                        />
                        <span className="item-qty-badge">{item.cantidad}</span>
                      </div>
                      <div className="summary-item-details">
                        <h4>{item.producto?.nombre}</h4>
                        <p>
                          ${Number(item.precioUnitario).toLocaleString("es-CL")}
                        </p>
                      </div>
                      <div className="summary-item-total">
                        ${Number(item.subtotal).toLocaleString("es-CL")}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-totals">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal?.toLocaleString("es-CL")}</span>
                  </div>
                  {discount > 0 && (
                    <div className="summary-row discount">
                      <span>
                        <span className="discount-tag">DESCUENTO DUOC</span>
                      </span>
                      <span>- ${discount?.toLocaleString("es-CL")}</span>
                    </div>
                  )}
                  <div className="summary-row shipping">
                    <span>Envío</span>
                    <span className="free-shipping">GRATIS</span>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-row total">
                    <span>Total a pagar</span>
                    <span>${total?.toLocaleString("es-CL")}</span>
                  </div>
                </div>

                <div className="security-badge">
                  <span className="lock-icon">🔒</span>
                  <p>Pago 100% Seguro y Encriptado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
