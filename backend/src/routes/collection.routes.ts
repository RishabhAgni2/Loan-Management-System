import { Router } from 'express';
import { getDisbursedLoans, recordPayment, getLoanPayments } from '../controllers/collection.controller';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();
router.use(protect, authorize('collection', 'admin'));
router.get('/loans', getDisbursedLoans);
router.post('/:id/payment', recordPayment);
router.get('/:id/payments', getLoanPayments);

export default router;