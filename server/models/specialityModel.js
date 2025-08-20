const mongoose = require('mongoose');

const specialitySchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Speciality = mongoose.model('Speciality', specialitySchema);

module.exports = Speciality;