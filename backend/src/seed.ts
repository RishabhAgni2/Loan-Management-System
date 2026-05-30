import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User, { UserRole } from './models/User';
import connectDB from './config/db';

const seedUsers: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}[] = [
  { name: 'Admin User',        email: 'admin@lms.com',        password: 'Admin@123',        role: 'admin' },
  { name: 'Sales Executive',   email: 'sales@lms.com',        password: 'Sales@123',        role: 'sales' },
  { name: 'Sanction Executive',email: 'sanction@lms.com',     password: 'Sanction@123',     role: 'sanction' },
  { name: 'Disburse Executive',email: 'disburse@lms.com',     password: 'Disburse@123',     role: 'disbursement' },
  { name: 'Collection Agent',  email: 'collection@lms.com',   password: 'Collection@123',   role: 'collection' },
  { name: 'Test Borrower',     email: 'borrower@lms.com',     password: 'Borrower@123',     role: 'borrower' },
];

const seed = async () => {
  await connectDB();
  await User.deleteMany({});
  for (const u of seedUsers) {
    await User.create(u);
  }
  console.log('✅ Seed complete. Users created:');
  seedUsers.forEach((u) => console.log(`  ${u.role.padEnd(12)} → ${u.email} / ${u.password}`));
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((e) => { console.error(e); process.exit(1); });
