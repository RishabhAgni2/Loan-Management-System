import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import LoanApplication from '../models/LoanApplication';
import Payment from '../models/Payment';

export const getDisbursedLoans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loans = await LoanApplication.find({ status: { $in: ['disbursed', 'closed'] } })
      .populate('borrower', 'name email')
      .sort({ disbursedAt: -1 });
    res.json({ loans });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const recordPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { utrNumber, amount, paymentDate } = req.body;
    const loan = await LoanApplication.findById(req.params.id);

    if (!loan || loan.status !== 'disbursed') {
      res.status(400).json({ message: 'Loan not found or not in disbursed state' });
      return;
    }

    if (!utrNumber || !amount || !paymentDate) {
      res.status(400).json({ message: 'UTR number, amount and payment date are required' });
      return;
    }

    // Validate UTR uniqueness
    const existingUTR = await Payment.findOne({ utrNumber: utrNumber.trim() });
    if (existingUTR) {
      res.status(409).json({ message: 'UTR number already exists. Each payment must have a unique UTR.' });
      return;
    }

    // Validate amount
    const outstanding = loan.totalRepayment - loan.totalPaid;
    if (Number(amount) <= 0) {
      res.status(400).json({ message: 'Payment amount must be greater than 0' });
      return;
    }
    if (Number(amount) > outstanding) {
      res.status(400).json({ message: `Amount exceeds outstanding balance of ₹${outstanding.toFixed(2)}` });
      return;
    }

    const payment = await Payment.create({
      loan: loan._id,
      borrower: loan.borrower,
      utrNumber: utrNumber.trim(),
      amount: Number(amount),
      paymentDate: new Date(paymentDate),
      recordedBy: req.user!._id,
    });

    loan.totalPaid += Number(amount);

    // Auto-close if fully paid
    if (loan.totalPaid >= loan.totalRepayment) {
      loan.status = 'closed';
      loan.closedAt = new Date();
    }

    await loan.save();
    res.json({
      message: loan.status === 'closed' ? 'Loan fully paid and closed!' : 'Payment recorded',
      payment,
      outstandingBalance: loan.totalRepayment - loan.totalPaid,
      loanStatus: loan.status,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(409).json({ message: 'UTR number already exists' });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLoanPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payments = await Payment.find({ loan: req.params.id })
      .populate('recordedBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ payments });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};