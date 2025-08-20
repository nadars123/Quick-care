const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  speciality_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Speciality",
      required: true,
    },
  ],
  experience: {
    type: Number,
    required: true,
  },
  office_Adresse: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  placement: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Will store the file path
    default: null,
  },
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
