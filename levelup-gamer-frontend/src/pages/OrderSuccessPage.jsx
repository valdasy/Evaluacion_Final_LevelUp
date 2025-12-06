// src/pages/OrderSuccessPage.jsx
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function OrderSuccessPage() {
  const { id } = useParams(); // coincide con /order-success o /order/:id si lo cambias

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="p-4 text-center">
            <h3 className="mb-2">¡Compra exitosa!</h3>
            {id && <p className="text-muted mb-1">N° de orden: {id}</p>}
            <p className="text-muted">
              Pronto recibirás un correo con el detalle de tu compra.
            </p>

            <div className="my-3">
              <small className="text-muted d-block mb-2">
                Puedes revisar tus compras en la sección "Mis pedidos".
              </small>
            </div>

            <div className="d-flex justify-content-center gap-2 mt-2">
              <Button as={Link} to="/orders" variant="primary">
                Ver mis pedidos
              </Button>
              <Button as={Link} to="/products" variant="outline-primary">
                Seguir comprando
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
