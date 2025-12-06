import React from "react";
import { render, screen } from "@testing-library/react";
import ReferralCode from "./ReferralCode";

describe("ReferralCode Component", () => {
  it("should render referral code", () => {
    render(<ReferralCode code="TEST123" />);
    expect(screen.getByText(/TEST123/i)).toBeInTheDocument();
  });
});
