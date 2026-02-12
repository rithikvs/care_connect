const mongoose = require('mongoose');
require('dotenv').config();

const Patient = require('./models/Patient');
const Volunteer = require('./models/Volunteer');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas...');

        // Clear existing data (optional)
        await Patient.deleteMany({});
        await Volunteer.deleteMany({});

        // Add a sample patient
        await Patient.create({
            full_name: "Test Patient",
            phone: "1234567890",
            location: "New York",
            problem_type: "General",
            description: "Initial setup test",
            priority: "NORMAL",
            summary: "Database initialized successfully"
        });

        // Add a sample volunteer
        await Volunteer.create({
            full_name: "Test Volunteer",
            phone: "0987654321",
            email: "test@example.com",
            skills: "First Aid",
            availability: "Weekends",
            location: "New York"
        });

        console.log('Database healthcare and collections (patients, volunteers) created with sample data!');
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedData();
