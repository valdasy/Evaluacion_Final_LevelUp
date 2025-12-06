import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart(product, quantity);
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 1000);
  };

  return (
    <Card className="product-card h-100">
      <Link
        to={`/product/${product.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="product-image-container">
          <Card.Img
            variant="top"
            src={
              product.image ||
              "https://via.placeholder.com/300x200?text=Product"
            }
            alt={product.name}
            className="product-image"
          />
          {product.discount && (
            <span className="discount-badge">-{product.discount}%</span>
          )}
        </div>
      </Link>

      <Card.Body className="d-flex flex-column">
        <Card.Subtitle className="mb-2 text-secondary product-code">
          {product.code}
        </Card.Subtitle>

        <Link
          to={`/product/${product.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Card.Title className="product-title">{product.name}</Card.Title>
        </Link>

        <Card.Text className="product-category text-secondary">
          {product.category}
        </Card.Text>

        <Card.Text className="product-description text-secondary">
          {product.description}
        </Card.Text>

        <div className="mt-auto">
          <div className="product-price mb-3">
            ${product.price.toLocaleString("es-CL")} CLP
          </div>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="form-control quantity-input"
              disabled={isAdding}
            />
            <Button
              variant="success"
              onClick={handleAddToCart}
              className="add-to-cart-btn"
              disabled={isAdding}
            >
              {isAdding ? "Agregado" : "Agregar"}
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
