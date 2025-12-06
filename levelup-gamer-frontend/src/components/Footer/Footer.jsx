import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <Container>
        <Row className="py-4">
          <Col md={4} className="mb-3 mb-md-0">
            <h5 className="footer-title">LEVEL-UP GAMER</h5>
            <p className="footer-text">
              Tu tienda online de productos gaming en Chile. Calidad y variedad
              para todos los gamers.
            </p>
          </Col>

          <Col md={4} className="mb-3 mb-md-0">
            <h6 className="footer-subtitle">Enlaces Rápidos</h6>
            <ul className="footer-links">
              <li>
                <a href="/">Inicio</a>
              </li>
              <li>
                <a href="/products/all">Productos</a>
              </li>
              <li>
                <a href="/cart">Carrito</a>
              </li>
              <li>
                <a href="/auth">Mi Cuenta</a>
              </li>
            </ul>
          </Col>

          <Col md={4}>
            <h6 className="footer-subtitle">Contacto</h6>
            <p className="footer-text mb-1">Email: contacto@levelupgamer.cl</p>
            <p className="footer-text mb-1">Teléfono: +56 9 1234 5678</p>
            <p className="footer-text">Despacho a todo Chile</p>
          </Col>
        </Row>

        <Row className="border-top pt-3">
          <Col className="text-center">
            <p className="footer-copyright mb-0">
              {currentYear} Level-Up Gamer. Proyecto académico DSY1104 - DuocUC
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
