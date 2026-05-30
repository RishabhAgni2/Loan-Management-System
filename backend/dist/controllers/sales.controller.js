"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeads = void 0;
const User_1 = __importDefault(require("../models/User"));
const LoanApplication_1 = __importDefault(require("../models/LoanApplication"));
// Sales sees: borrowers who signed up but have NO active application yet
const getLeads = async (req, res) => {
    try {
        const borrowers = await User_1.default.find({ role: 'borrower' }).select('-password');
        const borrowerIds = borrowers.map((b) => b._id);
        const appliedIds = await LoanApplication_1.default.distinct('borrower', {
            borrower: { $in: borrowerIds },
            status: { $ne: 'draft' },
        });
        const leads = borrowers.filter((b) => !appliedIds.some((id) => id.toString() === b._id.toString()));
        res.json({ leads, total: leads.length });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getLeads = getLeads;
