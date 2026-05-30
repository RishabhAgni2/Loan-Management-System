import mongoose, { Document, Schema } from 'mongoose';

export type LoanStatus = 'draft' | 'applied' | 'sanctioned' | 'rejected' | 'disbursed' | 'closed';
export type EmploymentMode = 'salaried' | 'self-employed' | 'unemployed';

export interface ILoanApplication extends Document {
  borrower: mongoose.Types.ObjectId;
  // Personal Details
  fullName: string;
  pan: string;
  dateOfBirth: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  // Salary Slip
  salarySlipUrl: string;
  salarySlipFileName: string;
  // Loan Config
  loanAmount: number;
  tenure: number;            // in days
  interestRate: number;      // fixed 12% p.a.
  simpleInterest: number;
  totalRepayment: number;
  // Status
  status: LoanStatus;
  rejectionReason?: string;
  // Payments tracking
  totalPaid: number;
  // Timestamps per stage
  appliedAt: Date;
  sanctionedAt?: Date;
  disbursedAt?: Date;
  closedAt?: Date;
  // Executive who handled each stage
  sanctionedBy?: mongoose.Types.ObjectId;
  disbursedBy?: mongoose.Types.ObjectId;
}

const LoanApplicationSchema = new Schema<ILoanApplication>(
  {
    borrower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    pan: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    monthlySalary: { type: Number, required: true },
    employmentMode: { type: String, enum: ['salaried', 'self-employed', 'unemployed'], required: true },
    salarySlipUrl: { type: String, default: '' },
    salarySlipFileName: { type: String, default: '' },
    loanAmount: { type: Number, min: 50000, max: 500000 },
    tenure: { type: Number, min: 30, max: 365 },
    interestRate: { type: Number, default: 12 },
    simpleInterest: { type: Number, default: 0 },
    totalRepayment: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'applied', 'sanctioned', 'rejected', 'disbursed', 'closed'],
      default: 'draft',
    },
    rejectionReason: { type: String },
    totalPaid: { type: Number, default: 0 },
    appliedAt: { type: Date, default: Date.now },
    sanctionedAt: { type: Date },
    disbursedAt: { type: Date },
    closedAt: { type: Date },
    sanctionedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    disbursedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model<ILoanApplication>('LoanApplication', LoanApplicationSchema);
