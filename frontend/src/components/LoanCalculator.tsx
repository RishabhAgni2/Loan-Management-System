interface LoanCalculatorProps {
  loanAmount: number;
  tenure: number;
}

const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function LoanCalculator({ loanAmount, tenure }: LoanCalculatorProps) {
  const rate = 12;
  const simpleInterest = (loanAmount * rate * tenure) / (365 * 100);
  const totalRepayment = loanAmount + simpleInterest;

  const rows = [
    ['Principal Amount', formatINR(loanAmount)],
    ['Interest Rate', '12% p.a.'],
    ['Tenure', `${tenure} days`],
    ['Simple Interest', formatINR(simpleInterest)],
  ];

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
      <h3 className="mb-3 font-semibold text-gray-700">Loan Summary</h3>
      <div className="space-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium text-gray-900">{value}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-blue-100 pt-2 font-bold text-blue-700">
          <span>Total Repayment</span>
          <span>{formatINR(totalRepayment)}</span>
        </div>
      </div>
    </div>
  );
}
