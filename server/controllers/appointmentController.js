const Appointment = require('../models/appointmentModel');
const mongoose = require('mongoose');
const User = require('../models/userModel');

exports.createAppointment = async (req, res) => {
    console.log('req ', req);
    try {
        const appointment = await Appointment.create(req.body);
        
        res.status(201).json({
            status: 'success',
            data: {
                appointment
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getAllAppointments = async (req, res) => {
  try {
    // Fetch all appointments and populate patient & doctor details
    const appointments = await Appointment.find()
      .populate("patient_id")
      .populate("doctor_id");

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No appointments found.",
        data: { updatedAppointments: [] },
      });
    }

    // Fetch all users to find doctor & patient details
    const users = await User.find();

    // Attach user details to appointments
    const updatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        let updatedAppointment = appointment.toObject(); // Convert Mongoose document to JS object

        // Attach doctor details
        if (appointment.doctor_id) {
          const doctorUser = users.find(
            (user) =>
              user.id_doctor?.toString() ===
              appointment.doctor_id._id.toString()
          );

          if (doctorUser) {
            updatedAppointment.doctorFirstName = doctorUser.first_name;
            updatedAppointment.doctorLastName = doctorUser.last_name;
            updatedAppointment.doctorEmail = doctorUser.email;
          }
        }

        // Attach patient details
        if (appointment.patient_id) {
          const patientUser = users.find(
            (user) =>
              user.id_patient?.toString() ===
              appointment.patient_id._id.toString()
          );

          if (patientUser) {
            updatedAppointment.patientFirstName = patientUser.first_name;
            updatedAppointment.patientLastName = patientUser.last_name;
            updatedAppointment.patientEmail = patientUser.email;
          }
        }

        return updatedAppointment;
      })
    );

    res.status(200).json({
      status: "success",
      results: updatedAppointments.length,
      data: { updatedAppointments }, // ✅ Ensures response matches frontend expectation
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patient_id', 'name')
            .populate('doctor_id', 'name');

        if (!appointment) {
            return res.status(404).json({
                status: 'fail',
                message: 'No appointment found with that ID'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                appointment
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getAppointmentsByPatientID = async (req, res) => {
  try {
    console.log("Fetching appointments for patient...");
    const patientId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid patient ID" });
    }

    const patientObjectId = new mongoose.Types.ObjectId(patientId);

    // Get all appointments for the patient
    const appointments = await Appointment.find({ patient_id: patientObjectId })
      .populate("patient_id") // Populate patient details
      .populate("doctor_id"); // Populate doctor details

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No appointments found for this patient.",
        data: [],
      });
    }

    // Retrieve doctor user data
    const updatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        if (!appointment.doctor_id) return appointment;

        const user = await User.findOne({
          id_doctor: appointment.doctor_id._id,
        });

        if (user) {
          appointment.doctorFirstName = user.first_name;
          appointment.doctorLastName = user.last_name;
          appointment.doctorEmail = user.email;
        }

        return appointment;
      })
    );

    res.status(200).json({
      status: "success",
      data: updatedAppointments,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


exports.getAppointmentsByDoctorID = async (req, res) => {
  try {
    const doctorId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid doctor ID" });
    }

    // Convert string ID to ObjectId
    const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

    // Find all appointments for the doctor
    const appointments = await Appointment.find({ doctor_id: doctorObjectId })
      .populate("patient_id") // Populate patient details
      .populate("doctor_id"); // Populate doctor details

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No appointments found for this doctor.",
        data: [],
      });
    }

    // Retrieve patient user data
    const updatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        if (!appointment.patient_id) return appointment;

        const user = await User.findOne({
          id_patient: appointment.patient_id._id,
        });

        if (user) {
          appointment.patientFirstName = user.first_name;
          appointment.patientLastName = user.last_name;
          appointment.patientEmail = user.email;
        }

        return appointment;
      })
    );

    res.status(200).json({
      status: "success",
      data: updatedAppointments,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!appointment) {
            return res.status(404).json({
                status: 'fail',
                message: 'No appointment found with that ID'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                appointment
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                status: 'fail',
                message: 'No appointment found with that ID'
            });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};