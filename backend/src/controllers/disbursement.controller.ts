import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import LoanApplication from '../models/LoanApplication';

export const getSanctionedLoans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loans = await LoanApplication.find({ status: 'sanctioned' })
      .populate('borrower', 'name email')
      .sort({ sanctionedAt: -1 });
    res.json({ loans });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const disburseLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loan = await LoanApplication.findById(req.params.id);
    if (!loan || loan.status !== 'sanctioned') {
      res.status(400).json({ message: 'Loan not found or not in sanctioned state' });
      return;
    }
    loan.status = 'disbursed';
    loan.disbursedAt = new Date();
    loan.disbursedBy = req.user!._id as any;
    await loan.save();
    res.json({ message: 'Loan disbursed', loan });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};