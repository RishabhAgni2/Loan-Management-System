"use strict";
// BRE MUST live on the server — client-side BRE can be bypassed.
// We can also show instant UI feedback on client using same rules,
// but the definitive check is always server-side.
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBRE = void 0;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const runBRE = (data) => {
    const errors = [];
    // Age check: must be between 23 and 50
    const today = new Date();
    const dob = new Date(data.dateOfBirth);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    if (age < 23 || age > 50) {
        errors.push(`Age must be between 23 and 50 years. Your age: ${age}`);
    }
    // Salary check: minimum ₹25,000/month
    if (data.monthlySalary < 25000) {
        errors.push(`Monthly salary must be at least ₹25,000. Provided: ₹${data.monthlySalary}`);
    }
    // PAN check: valid format
    if (!PAN_REGEX.test(data.pan.toUpperCase())) {
        errors.push('PAN number format is invalid. Expected format: ABCDE1234F');
    }
    // Employment check: must not be unemployed
    if (data.employmentMode === 'unemployed') {
        errors.push('Unemployed applicants are not eligible for a loan.');
    }
    return { passed: errors.length === 0, errors };
};
exports.runBRE = runBRE;
