import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  submitPersonalDetails,
  uploadSalarySlip,
  configureLoan,
  getLoanStatus,
} from '../controllers/borrower.controller';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only PDF, JPG, PNG files are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

router.use(protect, authorize('borrower'));

router.post('/personal-details', submitPersonalDetails);
router.post('/upload-salary-slip', upload.single('salarySlip'), uploadSalarySlip);
router.post('/configure-loan', configureLoan);
router.get('/loan-status', getLoanStatus);

export default router;