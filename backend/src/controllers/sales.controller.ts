import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import LoanApplication from '../models/LoanApplication';

// Sales sees: borrowers who signed up but have NO active application yet
export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const borrowers = await User.find({ role: 'borrower' }).select('-password');
    const borrowerIds = borrowers.map((b) => b._id);
    const appliedIds = await LoanApplication.distinct('borrower', {
      borrower: { $in: borrowerIds },
      status: { $ne: 'draft' },
    });

    const leads = borrowers.filter(
      (b) => !appliedIds.some((id) => id.toString() === b._id.toString())
    );

    res.json({ leads, total: leads.length });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
