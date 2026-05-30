export type UserRole = 'borrower' | 'sales' | 'sanction' | 'disbursement' | 'collection' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type LoanStatus = 'draft' | 'applied' | 'sanctioned' | 'rejected' | 'disbursed' | 'closed';

export interface LoanApplication {
  _id: string;
  borrower: { _id: string; name: string; email: string };
  fullName: string;
  pan: string;
  dateOfBirth: string;
  monthlySalary: number;
  employmentMode: string;
  salarySlipUrl: string;
  loanAmount: number;
  tenure: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
  totalPaid: number;
  status: LoanStatus;
  rejectionReason?: string;
  appliedAt: string;
  sanctionedAt?: string;
  disbursedAt?: string;
  closedAt?: string;
}

export interface Payment {
  _id: string;
  utrNumber: string;
  amount: number;
  paymentDate: string;
  recordedBy: { name: string };
}
