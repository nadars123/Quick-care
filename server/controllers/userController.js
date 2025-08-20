const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');
const Appointment = require('../models/appointmentModel');
const Speciality = require('../models/specialityModel');
const jwt = require('jsonwebtoken');
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");


// Register User (Already provided)
exports.registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, role, doctorData, patientData } = req.body;

        
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        let newUser = new User({
            first_name, // Fixed typo (was "fisrt_name")
            last_name,
            email,
            password: hashedPassword,
            role,
            id_doctor: null,
            id_patient: null
        });

        // Create doctor if doctorData exists
        if (doctorData) {
            const newDoctor = new Doctor(doctorData);
            await newDoctor.save();
            newUser.id_doctor = newDoctor._id;
        }

        // Create patient if patientData exists
        if (patientData) {
            const newPatient = new Patient({ ...patientData, medicale_info: newUser._id });
            await newPatient.save();
            newUser.id_patient = newPatient._id;
        }

        // Save the user
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      role,
      doctorData,
      patientData,
      oldPassword,
      newPassword,
    } = req.body;

    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.email = email || user.email;
    user.role = role || user.role;

    // Check if the user wants to update their password
    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect old password" });
      }

      // Hash new password and update
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (doctorData && user.id_doctor) {
      await Doctor.findByIdAndUpdate(user.id_doctor, doctorData);
    }

    if (patientData && user.id_patient) {
      await Patient.findByIdAndUpdate(user.id_patient, patientData);
    }

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.id_doctor) {
            await Doctor.findByIdAndDelete(user.id_doctor);
        }

        if (user.id_patient) {
            await Patient.findByIdAndDelete(user.id_patient);
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get User by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).populate('role id_doctor id_patient');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllStats = async (req, res) => {
    try {
        const doctor = await User.find({ role:  'Docteur' });
        const patient = await User.find({ role: 'Patient'});

        const appointment = await Appointment.find();
        const specialities = await Speciality.find();

        let responde = {
            doctorCount: doctor.length,
            appointmentCount: appointment.length,
            patientCount: patient.length,
            specialitiesCount: specialities.length,
        }
        res.status(200).json(responde);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role id_doctor id_patient');
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Users by Role ID
exports.getUsersByRole = async (req, res) => {
    try {
        const { roleId } = req.params;

        const users = await User.find({ role: roleId }).populate('role id_doctor id_patient');
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Populate doctor or patient info based on the role
        let doctorInfo = null;
        let patientInfo = null;

        if (user.id_doctor) {
            doctorInfo = await Doctor.findById(user.id_doctor);
        } else if (user.id_patient) {
            patientInfo = await Patient.findById(user.id_patient);
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Prepare response data
        const userInfo = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            doctorInfo,
            patientInfo,
            token
        };

        res.status(200).json({ message: 'Login successful', user: userInfo });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Users by Role: Doctor or Patient
exports.getUsersBySpecificRole = async (req, res) => {
    try {
        const { role } = req.params; // Expect 'doctor' or 'patient' as the role param

        // Check for valid role input
        if (role !== 'doctor' && role !== 'patient') {
            return res.status(400).json({ message: 'Invalid role type. Must be "doctor" or "patient".' });
        }

        // Fetch users based on role
        const users = await User.find({ role: role === 'doctor' ? 'Docteur' : 'Patient' })
    .populate({
        path: 'id_doctor', // Populate doctor information
        populate: {
            path: 'speciality_ids', // Now populate the specialities_ids inside the doctor
            model: 'Speciality' // Specify the model for specialities if it's not implicitly inferred
        }
    })
    .populate('role id_patient'); // Populate role and patient information


        if (!users.length) {
            return res.status(404).json({ message: `No users found with the role ${role}` });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.getDoctorSpecialities = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id)
    .select("speciality_ids")
    .lean();

 if(doctor) {    
     res.status(200).json(doctor.speciality_ids);
 } else {
    res.status(400).json({ message: "No Speciality founded"})
 }
};

exports.updateDoctorSpeciality = async (req, res) => {
     try {
       const { doctorId } = req.params;
       const { speciality_ids } = req.body; // Expecting an array of ObjectId strings

       if (!Array.isArray(speciality_ids)) {
         return res
           .status(400)
           .json({ message: "speciality_ids must be an array" });
       }

       // Update only the speciality_ids field
       const updatedDoctor = await Doctor.findByIdAndUpdate(
         doctorId,
         { speciality_ids },
         { new: true } // Return the updated document
       );

       if (!updatedDoctor) {
         return res.status(404).json({ message: "Doctor not found" });
       }

       res.json(updatedDoctor);
     } catch (error) {
       console.error("Error updating specialities:", error);
       res.status(500).json({ message: "Server error" });
     }
}

exports.updateDoctorImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imagePath = req.file.path; // Path of uploaded image

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { image: imagePath },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Image updated successfully", doctor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getDoctorImage = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!doctor.image) {
      return res
        .status(404)
        .json({ message: "No image found for this doctor" });
    }

    // Get the image path
    const imagePath = path.join(__dirname, "../", doctor.image);

    // Check if the image exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: "Image file not found" });
    }

    res.sendFile(imagePath);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Forgot Password Controller
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        const resetLink = `http://localhost:5173/resetPassword/${token}`;

      
        
        const transporter = nodemailer.createTransport({
          service: "gmail",
          // You can change this based on your email service provider
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        console.log(transporter);
        
        
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: "Password Reset Request",
          html: ` <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #227a69;">Reset Your Password - QuikHealth</h2>
    <p>We received a request to reset your password for your QuikHealth account. If you made this request, click the button below to set a new password.</p>
    <p style="text-align: center;">
      <a href="${resetLink}" 
         style="background-color: #227a69; color: #fff; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
        Reset Password
      </a>
    </p>
    <p>If you did not request a password reset, you can safely ignore this email. This link will expire in <strong>1 hour</strong>.</p>
    <p>Need help? Contact our support team at <a href="mailto:support@quikhealth.com">support@quikhealth.com</a>.</p>
    <p style="margin-top: 20px; font-size: 14px; color: #777;">- The QuikHealth Team</p>
  </div>`,
        });
        
        res.status(200).json({ message: 'Reset link sent to email' });
    
};

// Reset Password Controller
exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token', error });
    }
};
