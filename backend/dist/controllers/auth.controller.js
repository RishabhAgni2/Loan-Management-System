"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        const exists = await User_1.default.findOne({ email });
        if (exists) {
            res.status(409).json({ message: 'Email already registered' });
            return;
        }
        const user = await User_1.default.create({ name, email, password, role: 'borrower' });
        res.status(201).json({
            token: generateToken(user._id.toString()),
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        res.json({
            token: generateToken(user._id.toString()),
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    res.json({ user: req.user });
};
exports.getMe = getMe;
