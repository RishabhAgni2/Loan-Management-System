// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import path from 'path';
// import fs from 'fs';
// import connectDB from './config/db';

// import authRoutes from './routes/auth.routes';
// import borrowerRoutes from './routes/borrower.routes';
// import salesRoutes from './routes/sales.routes';
// import sanctionRoutes from './routes/sanction.routes';
// import disbursementRoutes from './routes/disbursement.routes';
// import collectionRoutes from './routes/collection.routes';

// dotenv.config();
// connectDB();
// fs.mkdirSync(path.join(__dirname, '../uploads'), { recursive: true });

// const app = express();
// const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
//   .split(',')
//   .map((origin) => origin.trim());

// app.use(cors({ origin: allowedOrigins, credentials: true }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve uploaded files
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/borrower', borrowerRoutes);
// app.use('/api/sales', salesRoutes);
// app.use('/api/sanction', sanctionRoutes);
// app.use('/api/disbursement', disbursementRoutes);
// app.use('/api/collection', collectionRoutes);

// app.get('/', (req, res) => res.json({ message: 'Loan Management System API is running' }));
// app.get('/health', (req, res) => res.json({ status: 'ok' }));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import connectDB from './config/db';

import authRoutes from './routes/auth.routes';
import borrowerRoutes from './routes/borrower.routes';
import salesRoutes from './routes/sales.routes';
import sanctionRoutes from './routes/sanction.routes';
import disbursementRoutes from './routes/disbursement.routes';
import collectionRoutes from './routes/collection.routes';

dotenv.config();
connectDB();
fs.mkdirSync(path.join(__dirname, '../uploads'), { recursive: true });

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim());

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, server-to-server, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests for every route — MUST be before other routes
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/borrower', borrowerRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/sanction', sanctionRoutes);
app.use('/api/disbursement', disbursementRoutes);
app.use('/api/collection', collectionRoutes);

app.get('/', (_req, res) => res.json({ message: 'Loan Management System API is running' }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));