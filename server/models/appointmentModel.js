const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    appointment_date: {
        type: Date,
        required: true
    },
    appointment_time: {
        type: String,
        required: true
    },
    doctorFirstName: {
        type: String,
        required: false
    },
    doctorLastName: {
        type: String,
        required: false
    },
    doctorEmail: {
        type: String,
        required: false
    },
    patientFirstName: {
        type: String,
        required: false
    },  patientLastName: {
        type: String,
        required: false
    },  patientEmail: {
        type: String,
        required: false
    },



});

const Appointment = mongoose.model('Appointment', appointmentSchema);   

module.exports = Appointment;