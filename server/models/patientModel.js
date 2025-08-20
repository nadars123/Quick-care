const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    birth_date: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        default: null
    },
    Adresse: {
        type: String,
        required: true
    },
    phone_number : {
        type: String,
        required: true
    },
    medicale_info : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
})

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;