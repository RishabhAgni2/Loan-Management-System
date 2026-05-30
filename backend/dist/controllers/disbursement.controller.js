"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disburseLoan = exports.getSanctionedLoans = void 0;
const LoanApplication_1 = __importDefault(require("../models/LoanApplication"));
const getSanctionedLoans = async (req, res) => {
    try {
        const loans = await LoanApplication_1.default.find({ status: 'sanctioned' })
            .populate('borrower', 'name email')
            .sort({ sanctionedAt: -1 });
        res.json({ loans });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getSanctionedLoans = getSanctionedLoans;
const disburseLoan = async (req, res) => {
    try {
        const loan = await LoanApplication_1.default.findById(req.params.id);
        if (!loan || loan.status !== 'sanctioned') {
            res.status(400).json({ message: 'Loan not found or not in sanctioned state' });
            return;
        }
        loan.status = 'disbursed';
        loan.disbursedAt = new Date();
        loan.disbursedBy = req.user._id;
        await loan.save();
        res.json({ message: 'Loan disbursed', loan });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.disburseLoan = disburseLoan;
