const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    skills: { type: String, required: true },
    availability: { type: String, required: true },
    location: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);
