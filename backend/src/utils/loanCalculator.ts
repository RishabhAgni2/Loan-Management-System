// Simple Interest: SI = (P × R × T) / (365 × 100)
// where T = tenure in days, R = 12% p.a.

export const calculateLoan = (principal: number, tenureDays: number) => {
  const rate = 12; // fixed 12% p.a.
  const simpleInterest = (principal * rate * tenureDays) / (365 * 100);
  const totalRepayment = principal + simpleInterest;
  return {
    simpleInterest: Math.round(simpleInterest * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
    rate,
  };
};