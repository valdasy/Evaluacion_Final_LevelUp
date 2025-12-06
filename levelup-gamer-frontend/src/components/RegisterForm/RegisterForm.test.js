import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RegisterForm from "./RegisterForm";

describe("RegisterForm Component", () => {
  const mockSetUser = jest.fn();
  const mockSwitchToLogin = jest.fn();

  beforeEach(() => {
    mockSetUser.mockClear();
    mockSwitchToLogin.mockClear();
  });

  test("renders all registration fields", () => {
    render(
      <RegisterForm setUser={mockSetUser} switchToLogin={mockSwitchToLogin} />
    );

    expect(screen.getByPlaceholderText("tu@email.com")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Mínimo 6 caracteres")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Registrarse/i })
    ).toBeInTheDocument();
  });

  test("shows error for users under 18", () => {
    render(
      <RegisterForm setUser={mockSetUser} switchToLogin={mockSwitchToLogin} />
    );

    // Llenar todos los campos requeridos
    const nameInput = screen.getByLabelText(/Nombre Completo/i);
    const emailInput = screen.getByLabelText(/^Email$/i);
    const birthDateInput = screen.getByLabelText(/Fecha de Nacimiento/i);
    const passwordInput = screen.getByLabelText(/^Contraseña$/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirmar Contraseña/i);
    const submitButton = screen.getByRole("button", { name: /Registrarse/i });

    // Fecha que da menos de 18 años
    const recentDate = new Date();
    recentDate.setFullYear(recentDate.getFullYear() - 10);
    const dateString = recentDate.toISOString().split("T")[0];

    fireEvent.change(nameInput, { target: { value: "Juan Pérez" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(birthDateInput, { target: { value: dateString } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(submitButton);

    expect(screen.getByText("Debes ser mayor de 18 años")).toBeInTheDocument();
  });

  test("shows error when passwords do not match", () => {
    render(
      <RegisterForm setUser={mockSetUser} switchToLogin={mockSwitchToLogin} />
    );

    // Llenar todos los campos
    const nameInput = screen.getByLabelText(/Nombre Completo/i);
    const emailInput = screen.getByLabelText(/^Email$/i);
    const birthDateInput = screen.getByLabelText(/Fecha de Nacimiento/i);
    const passwordInput = screen.getByLabelText(/^Contraseña$/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirmar Contraseña/i);
    const submitButton = screen.getByRole("button", { name: /Registrarse/i });

    // Fecha válida (mayor de 18)
    const validDate = new Date();
    validDate.setFullYear(validDate.getFullYear() - 25);
    const dateString = validDate.toISOString().split("T")[0];

    fireEvent.change(nameInput, { target: { value: "Juan Pérez" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(birthDateInput, { target: { value: dateString } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "different" } });
    fireEvent.click(submitButton);

    expect(
      screen.getByText("Las contraseñas no coinciden")
    ).toBeInTheDocument();
  });
});
