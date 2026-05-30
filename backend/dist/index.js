"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const db_1 = __importDefault(require("./config/db"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const borrower_routes_1 = __importDefault(require("./routes/borrower.routes"));
const sales_routes_1 = __importDefault(require("./routes/sales.routes"));
const sanction_routes_1 = __importDefault(require("./routes/sanction.routes"));
const disbursement_routes_1 = __importDefault(require("./routes/disbursement.routes"));
const collection_routes_1 = __importDefault(require("./routes/collection.routes"));
dotenv_1.default.config();
(0, db_1.default)();
fs_1.default.mkdirSync(path_1.default.join(__dirname, '../uploads'), { recursive: true });
const app = (0, express_1.default)();
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim());
app.use((0, cors_1.default)({ origin: allowedOrigins, credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve uploaded files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/borrower', borrower_routes_1.default);
app.use('/api/sales', sales_routes_1.default);
app.use('/api/sanction', sanction_routes_1.default);
app.use('/api/disbursement', disbursement_routes_1.default);
app.use('/api/collection', collection_routes_1.default);
app.get('/', (req, res) => res.json({ message: 'Loan Management System API is running' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
