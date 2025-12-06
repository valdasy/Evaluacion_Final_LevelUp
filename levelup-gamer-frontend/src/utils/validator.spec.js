import {
  validateEmail,
  isOver18,
  validatePassword,
  isDuocEmail,
} from "./validators";

describe("Validators", () => {
  describe("validateEmail", () => {
    it("should return true for valid email", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user@duocuc.cl")).toBe(true);
    });

    it("should return false for invalid email", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
    });
  });

  describe("isOver18", () => {
    it("should return true for users over 18", () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 20);
      const dateString = date.toISOString().split("T")[0];
      expect(isOver18(dateString)).toBe(true);
    });

    it("should return false for users under 18", () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 15);
      const dateString = date.toISOString().split("T")[0];
      expect(isOver18(dateString)).toBe(false);
    });
  });

  describe("isDuocEmail", () => {
    it("should return true for DuocUC email", () => {
      expect(isDuocEmail("student@duocuc.cl")).toBe(true);
      expect(isDuocEmail("STUDENT@DUOCUC.CL")).toBe(true);
    });

    it("should return false for non-DuocUC email", () => {
      expect(isDuocEmail("test@gmail.com")).toBe(false);
    });
  });

  describe("validatePassword", () => {
    it("should return true for valid password", () => {
      expect(validatePassword("password123")).toBe(true);
      expect(validatePassword("123456")).toBe(true);
    });

    it("should return false for short password", () => {
      expect(validatePassword("123")).toBe(false);
      expect(validatePassword("ab")).toBe(false);
    });
  });
});
