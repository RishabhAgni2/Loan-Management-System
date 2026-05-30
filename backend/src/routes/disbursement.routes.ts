import { Router } from 'express';
import { getSanctionedLoans, disburseLoan } from '../controllers/disbursement.controller';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();
router.use(protect, authorize('disbursement', 'admin'));
router.get('/loans', getSanctionedLoans);
router.patch('/:id/disburse', disburseLoan);

export default router;