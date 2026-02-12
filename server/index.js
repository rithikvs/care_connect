const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Patient = require('./models/Patient');
const Volunteer = require('./models/Volunteer');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Auth Middleware
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Authentication required. Please login.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token. Please login again.' });
    }
};

const adminMiddleware = (req, res, next) => {
    authMiddleware(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
        }
    });
};

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.includes('<username>')) {
    console.error('❌ ERROR: MONGODB_URI is not configured!');
    console.error('Please update your server/.env file with your actual MongoDB Atlas connection string.');
    console.error('Current URI:', MONGODB_URI);
} else {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('✅ Connected to MongoDB Atlas'))
        .catch(err => {
            console.error('❌ MongoDB connection error:', err.message);
            if (err.message.includes('IP not whitelisted')) {
                console.error('👉 Tip: Ensure your current IP address is whitelisted in MongoDB Atlas.');
            }
        });
}

// Routes
// Authentication
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hardcoded Super Admin Check (requested by user)
        if (email === "admin@gmail.com" && password === "1234") {
            const token = jwt.sign({ id: 'admin_id', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token, user: { id: 'admin_id', name: 'Admin', email: 'admin@gmail.com', role: 'admin' } });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Patients
app.get('/api/patients', adminMiddleware, async (req, res) => {
    try {
        const patients = await Patient.find().sort({ created_at: -1 });
        res.json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/patients', authMiddleware, async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        const savedPatient = await newPatient.save();
        res.status(201).json(savedPatient);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/patients/:id', adminMiddleware, async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.json({ message: 'Patient deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Volunteers
app.get('/api/volunteers', adminMiddleware, async (req, res) => {
    try {
        const volunteers = await Volunteer.find().sort({ created_at: -1 });
        res.json(volunteers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/volunteers', authMiddleware, async (req, res) => {
    try {
        const newVolunteer = new Volunteer(req.body);
        const savedVolunteer = await newVolunteer.save();
        res.status(201).json(savedVolunteer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/volunteers/:id', adminMiddleware, async (req, res) => {
    try {
        await Volunteer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Volunteer deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Final fallback to serve the frontend index.html for any non-API routes
// Using app.use middleware instead of app.get('*' to avoid Express 5 path-to-regexp errors
app.use((req, res) => {
    // If it's an API route that didn't match, return 404
    if (req.url.startsWith('/api/')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
