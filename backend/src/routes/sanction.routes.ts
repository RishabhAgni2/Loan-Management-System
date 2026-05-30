import { Router } from 'express';
import { getAppliedLoans, sanctionLoan, rejectLoan } from '../controllers/sanction.controller';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();
router.use(protect, authorize('sanction', 'admin'));
router.get('/applications', getAppliedLoans);
router.patch('/:id/sanction', sanctionLoan);
router.patch('/:id/reject', rejectLoan);

export default router;