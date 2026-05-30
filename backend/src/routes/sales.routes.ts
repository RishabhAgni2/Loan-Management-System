import { Router } from 'express';
import { getLeads } from '../controllers/sales.controller';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();
router.use(protect, authorize('sales', 'admin'));
router.get('/leads', getLeads);

export default router;