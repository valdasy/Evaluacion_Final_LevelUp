import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterBar from "./FilterBar";

describe("FilterBar Component", () => {
  const mockCategories = ["Consolas", "Accesorios", "Juegos de Mesa"];
  const mockOnCategoryChange = jest.fn();
  const mockOnSearchChange = jest.fn();

  beforeEach(() => {
    mockOnCategoryChange.mockClear();
    mockOnSearchChange.mockClear();
  });

  test("renders search input", () => {
    render(
      <FilterBar
        categories={mockCategories}
        selectedCategory="all"
        onCategoryChange={mockOnCategoryChange}
        searchTerm=""
        onSearchChange={mockOnSearchChange}
      />
    );

    expect(
      screen.getByPlaceholderText("Buscar productos...")
    ).toBeInTheDocument();
  });

  test("renders category select with all categories", () => {
    render(
      <FilterBar
        categories={mockCategories}
        selectedCategory="all"
        onCategoryChange={mockOnCategoryChange}
        searchTerm=""
        onSearchChange={mockOnSearchChange}
      />
    );

    expect(screen.getByText("Todas las Categorías")).toBeInTheDocument();
    expect(screen.getByText("Consolas")).toBeInTheDocument();
    expect(screen.getByText("Accesorios")).toBeInTheDocument();
  });

  test("calls onSearchChange when typing in search input", () => {
    render(
      <FilterBar
        categories={mockCategories}
        selectedCategory="all"
        onCategoryChange={mockOnCategoryChange}
        searchTerm=""
        onSearchChange={mockOnSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText("Buscar productos...");
    fireEvent.change(searchInput, { target: { value: "PlayStation" } });

    expect(mockOnSearchChange).toHaveBeenCalledWith("PlayStation");
  });

  test("calls onCategoryChange when selecting a category", () => {
    render(
      <FilterBar
        categories={mockCategories}
        selectedCategory="all"
        onCategoryChange={mockOnCategoryChange}
        searchTerm=""
        onSearchChange={mockOnSearchChange}
      />
    );

    const categorySelect = screen.getByDisplayValue("Todas las Categorías");
    fireEvent.change(categorySelect, { target: { value: "Consolas" } });

    expect(mockOnCategoryChange).toHaveBeenCalledWith("Consolas");
  });
});
