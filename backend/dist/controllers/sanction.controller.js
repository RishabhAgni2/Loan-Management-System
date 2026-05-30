"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectLoan = exports.sanctionLoan = exports.getAppliedLoans = void 0;
const LoanApplication_1 = __importDefault(require("../models/LoanApplication"));
const getAppliedLoans = async (req, res) => {
    try {
        const loans = await LoanApplication_1.default.find({ status: 'applied' })
            .populate('borrower', 'name email')
            .sort({ appliedAt: -1 });
        res.json({ loans });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAppliedLoans = getAppliedLoans;
const sanctionLoan = async (req, res) => {
    try {
        const loan = await LoanApplication_1.default.findById(req.params.id);
        if (!loan || loan.status !== 'applied') {
            res.status(400).json({ message: 'Loan not found or not in applied state' });
            return;
        }
        loan.status = 'sanctioned';
        loan.sanctionedAt = new Date();
        loan.sanctionedBy = req.user._id;
        await loan.save();
        res.json({ message: 'Loan sanctioned', loan });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.sanctionLoan = sanctionLoan;
const rejectLoan = async (req, res) => {
    try {
        const { reason } = req.body;
        if (!reason) {
            res.status(400).json({ message: 'Rejection reason is required' });
            return;
        }
        const loan = await LoanApplication_1.default.findById(req.params.id);
        if (!loan || loan.status !== 'applied') {
            res.status(400).json({ message: 'Loan not found or not in applied state' });
            return;
        }
        loan.status = 'rejected';
        loan.rejectionReason = reason;
        await loan.save();
        res.json({ message: 'Loan rejected', loan });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.rejectLoan = rejectLoan;
