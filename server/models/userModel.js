const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role : {
        type: String,
        required: true
    },
    id_patient : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        default: null
    },
    id_doctor : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        default: null
    }
}); 

const User = mongoose.model('User', userSchema);

module.exports = User;
