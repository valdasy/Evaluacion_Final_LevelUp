import {
  validateEmail,
  validateAge,
  isOver18,
  isDuocEmail,
  validatePassword,
  validateReferralCode,
} from "./validators";

describe("Validator Functions", () => {
  describe("validateEmail", () => {
    test("returns true for valid email", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user@duocuc.cl")).toBe(true);
    });

    test("returns false for invalid email", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
    });
  });

  describe("isOver18", () => {
    test("returns true for users over 18", () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 20);
      expect(isOver18(date.toISOString().split("T")[0])).toBe(true);
    });

    test("returns false for users under 18", () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 15);
      expect(isOver18(date.toISOString().split("T")[0])).toBe(false);
    });
  });

  describe("isDuocEmail", () => {
    test("returns true for DuocUC email", () => {
      expect(isDuocEmail("student@duocuc.cl")).toBe(true);
      expect(isDuocEmail("STUDENT@DUOCUC.CL")).toBe(true);
    });

    test("returns false for non-DuocUC email", () => {
      expect(isDuocEmail("test@gmail.com")).toBe(false);
    });
  });

  describe("validatePassword", () => {
    test("returns true for valid password", () => {
      expect(validatePassword("password123")).toBe(true);
    });

    test("returns false for short password", () => {
      expect(validatePassword("123")).toBe(false);
    });
  });
});
