"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoanStatus = exports.configureLoan = exports.uploadSalarySlip = exports.submitPersonalDetails = void 0;
const LoanApplication_1 = __importDefault(require("../models/LoanApplication"));
const bre_1 = require("../utils/bre");
const loanCalculator_1 = require("../utils/loanCalculator");
// Step 2: Submit personal details + run BRE
const submitPersonalDetails = async (req, res) => {
    try {
        const { fullName, pan, dateOfBirth, monthlySalary, employmentMode } = req.body;
        // Run BRE on server
        const breResult = (0, bre_1.runBRE)({
            dateOfBirth: new Date(dateOfBirth),
            monthlySalary: Number(monthlySalary),
            pan: pan.toUpperCase(),
            employmentMode,
        });
        if (!breResult.passed) {
            res.status(422).json({ message: 'BRE check failed', errors: breResult.errors });
            return;
        }
        // Check if application already exists for this user
        let application = await LoanApplication_1.default.findOne({ borrower: req.user._id });
        if (application && ['applied', 'sanctioned', 'disbursed'].includes(application.status)) {
            res.status(409).json({ message: 'You already have an active loan application.' });
            return;
        }
        // Create or update draft application
        if (!application) {
            application = new LoanApplication_1.default({
                borrower: req.user._id,
                fullName,
                pan: pan.toUpperCase(),
                dateOfBirth: new Date(dateOfBirth),
                monthlySalary: Number(monthlySalary),
                employmentMode,
                status: 'draft',
            });
        }
        else {
            application.fullName = fullName;
            application.pan = pan.toUpperCase();
            application.dateOfBirth = new Date(dateOfBirth);
            application.monthlySalary = Number(monthlySalary);
            application.employmentMode = employmentMode;
        }
        await application.save();
        res.json({ message: 'Personal details saved. BRE passed.', applicationId: application._id });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.submitPersonalDetails = submitPersonalDetails;
// Step 3: Upload salary slip
const uploadSalarySlip = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }
        const application = await LoanApplication_1.default.findOne({ borrower: req.user._id });
        if (!application) {
            res.status(404).json({ message: 'Application not found. Complete personal details first.' });
            return;
        }
        application.salarySlipUrl = `/uploads/${req.file.filename}`;
        application.salarySlipFileName = req.file.originalname;
        await application.save();
        res.json({ message: 'Salary slip uploaded', fileUrl: application.salarySlipUrl });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.uploadSalarySlip = uploadSalarySlip;
// Step 4: Configure loan and apply
const configureLoan = async (req, res) => {
    try {
        const { loanAmount, tenure } = req.body;
        if (loanAmount < 50000 || loanAmount > 500000) {
            res.status(400).json({ message: 'Loan amount must be between ₹50,000 and ₹5,00,000' });
            return;
        }
        if (tenure < 30 || tenure > 365) {
            res.status(400).json({ message: 'Tenure must be between 30 and 365 days' });
            return;
        }
        const application = await LoanApplication_1.default.findOne({ borrower: req.user._id });
        if (!application) {
            res.status(404).json({ message: 'Application not found' });
            return;
        }
        if (!application.salarySlipUrl) {
            res.status(400).json({ message: 'Please upload salary slip first' });
            return;
        }
        const { simpleInterest, totalRepayment, rate } = (0, loanCalculator_1.calculateLoan)(Number(loanAmount), Number(tenure));
        application.loanAmount = Number(loanAmount);
        application.tenure = Number(tenure);
        application.interestRate = rate;
        application.simpleInterest = simpleInterest;
        application.totalRepayment = totalRepayment;
        application.status = 'applied';
        application.appliedAt = new Date();
        await application.save();
        res.json({
            message: 'Loan application submitted!',
            loan: {
                loanAmount,
                tenure,
                simpleInterest,
                totalRepayment,
                status: application.status,
            },
        });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.configureLoan = configureLoan;
// Get loan status
const getLoanStatus = async (req, res) => {
    try {
        const application = await LoanApplication_1.default.findOne({ borrower: req.user._id })
            .populate('borrower', 'name email');
        if (!application) {
            res.status(404).json({ message: 'No application found' });
            return;
        }
        res.json({ application });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getLoanStatus = getLoanStatus;
