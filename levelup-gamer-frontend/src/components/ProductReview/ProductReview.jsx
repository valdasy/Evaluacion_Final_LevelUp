import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import "./ProductReview.css";

const ProductReview = ({ productId, onSubmitReview }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName.trim() && comment.trim()) {
      onSubmitReview({
        productId,
        rating,
        comment,
        userName,
        date: new Date().toISOString(),
      });
      setComment("");
      setUserName("");
      setRating(5);
    }
  };

  return (
    <Card className="review-card">
      <Card.Body>
        <h5 className="mb-3">Deja tu Reseña</h5>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="review-name">Tu Nombre</Form.Label>
            <Form.Control
              id="review-name"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Nombre"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="review-rating">
              Calificación: {rating} estrellas
            </Form.Label>
            <Form.Range
              id="review-rating"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
            />
            <div className="star-display">
              {"★".repeat(rating)}
              {"☆".repeat(5 - rating)}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="review-comment">Comentario</Form.Label>
            <Form.Control
              id="review-comment"
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe tu opinión sobre el producto..."
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Publicar Reseña
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ProductReview;
