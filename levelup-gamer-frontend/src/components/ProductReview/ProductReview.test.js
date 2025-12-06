import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductReview from "./ProductReview";

describe("ProductReview Component", () => {
  const mockOnSubmitReview = jest.fn();

  beforeEach(() => {
    mockOnSubmitReview.mockClear();
  });

  test("renders review form", () => {
    render(
      <ProductReview productId="TEST001" onSubmitReview={mockOnSubmitReview} />
    );

    expect(screen.getByText("Deja tu Reseña")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nombre")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Escribe tu opinión/i)
    ).toBeInTheDocument();
  });

  test("allows user to set rating", () => {
    render(
      <ProductReview productId="TEST001" onSubmitReview={mockOnSubmitReview} />
    );

    const ratingSlider = screen.getByRole("slider");
    fireEvent.change(ratingSlider, { target: { value: "3" } });

    expect(screen.getByText(/Calificación: 3 estrellas/i)).toBeInTheDocument();
  });

  test("submits review with correct data", () => {
    render(
      <ProductReview productId="TEST001" onSubmitReview={mockOnSubmitReview} />
    );

    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByRole("slider"), { target: { value: "4" } });
    fireEvent.change(screen.getByPlaceholderText(/Escribe tu opinión/i), {
      target: { value: "Excelente producto" },
    });

    const submitButton = screen.getByRole("button", {
      name: /Publicar Reseña/i,
    });
    fireEvent.click(submitButton);

    expect(mockOnSubmitReview).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: "TEST001",
        rating: 4,
        comment: "Excelente producto",
        userName: "Juan Pérez",
      })
    );
  });
});
