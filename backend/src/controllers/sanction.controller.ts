import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import LoanApplication from '../models/LoanApplication';

export const getAppliedLoans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loans = await LoanApplication.find({ status: 'applied' })
      .populate('borrower', 'name email')
      .sort({ appliedAt: -1 });
    res.json({ loans });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const sanctionLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loan = await LoanApplication.findById(req.params.id);
    if (!loan || loan.status !== 'applied') {
      res.status(400).json({ message: 'Loan not found or not in applied state' });
      return;
    }
    loan.status = 'sanctioned';
    loan.sanctionedAt = new Date();
    loan.sanctionedBy = req.user!._id as any;
    await loan.save();
    res.json({ message: 'Loan sanctioned', loan });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reason } = req.body;
    if (!reason) {
      res.status(400).json({ message: 'Rejection reason is required' });
      return;
    }
    const loan = await LoanApplication.findById(req.params.id);
    if (!loan || loan.status !== 'applied') {
      res.status(400).json({ message: 'Loan not found or not in applied state' });
      return;
    }
    loan.status = 'rejected';
    loan.rejectionReason = reason;
    await loan.save();
    res.json({ message: 'Loan rejected', loan });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};