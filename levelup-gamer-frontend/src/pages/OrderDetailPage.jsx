// src/pages/OrderDetailPage.jsx
import { useParams, Link } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";

export default function OrderDetailPage() {
  const { id } = useParams(); // coincide con /order/:id

  return (
    <Container className="my-4">
      <Card className="p-4 text-center">
        <h4>Detalle de pedido</h4>
        <p className="text-muted">
          El detalle de la boleta #{id} aún no está disponible.
        </p>
        <Button as={Link} to="/orders">
          Volver a mis pedidos
        </Button>
      </Card>
    </Container>
  );
}
