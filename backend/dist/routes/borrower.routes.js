"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const borrower_controller_1 = require("../controllers/borrower.controller");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const router = (0, express_1.Router)();
// Multer config
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path_1.default.extname(file.originalname));
    },
});
const fileFilter = (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowed.includes(file.mimetype))
        cb(null, true);
    else
        cb(new Error('Only PDF, JPG, PNG files are allowed'));
};
const upload = (0, multer_1.default)({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB
router.use(auth_1.protect, (0, rbac_1.authorize)('borrower'));
router.post('/personal-details', borrower_controller_1.submitPersonalDetails);
router.post('/upload-salary-slip', upload.single('salarySlip'), borrower_controller_1.uploadSalarySlip);
router.post('/configure-loan', borrower_controller_1.configureLoan);
router.get('/loan-status', borrower_controller_1.getLoanStatus);
exports.default = router;
