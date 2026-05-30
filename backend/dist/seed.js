"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./models/User"));
const db_1 = __importDefault(require("./config/db"));
const seedUsers = [
    { name: 'Admin User', email: 'admin@lms.com', password: 'Admin@123', role: 'admin' },
    { name: 'Sales Executive', email: 'sales@lms.com', password: 'Sales@123', role: 'sales' },
    { name: 'Sanction Executive', email: 'sanction@lms.com', password: 'Sanction@123', role: 'sanction' },
    { name: 'Disburse Executive', email: 'disburse@lms.com', password: 'Disburse@123', role: 'disbursement' },
    { name: 'Collection Agent', email: 'collection@lms.com', password: 'Collection@123', role: 'collection' },
    { name: 'Test Borrower', email: 'borrower@lms.com', password: 'Borrower@123', role: 'borrower' },
];
const seed = async () => {
    await (0, db_1.default)();
    await User_1.default.deleteMany({});
    for (const u of seedUsers) {
        await User_1.default.create(u);
    }
    console.log('✅ Seed complete. Users created:');
    seedUsers.forEach((u) => console.log(`  ${u.role.padEnd(12)} → ${u.email} / ${u.password}`));
    await mongoose_1.default.disconnect();
    process.exit(0);
};
seed().catch((e) => { console.error(e); process.exit(1); });
