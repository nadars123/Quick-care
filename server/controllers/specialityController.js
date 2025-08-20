const Speciality = require('../models/specialityModel');

// Create a new speciality
exports.createSpeciality = async (req, res) => {
    try {
        // Check if a speciality with the same label already exists
        const existingSpeciality = await Speciality.findOne({ label: req.body.label });
        
        if (existingSpeciality) {
            return res.status(400).json({ message: 'Speciality with this label already exists' });
        }

        // Create a new speciality instance
        const speciality = new Speciality({
            label: req.body.label,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Save the speciality to the database
        await speciality.save();

        // Respond with the newly created speciality
        res.status(201).json(speciality);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all specialities
exports.getAllSpecialities = async (req, res) => {
    try {
        const specialities = await Speciality.find();
        res.status(200).json(specialities);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get speciality by ID
exports.getSpecialityById = async (req, res) => {
    try {
        const speciality = await Speciality.findById(req.params.id);

        if (!speciality) {
            return res.status(404).json({ message: 'Speciality not found' });
        }

        res.status(200).json(speciality);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update speciality by ID
exports.updateSpeciality = async (req, res) => {
    try {
        // Check if a speciality with the same label already exists (except for the current one)
        const existingSpeciality = await Speciality.findOne({ label: req.body.label });
        
        if (existingSpeciality && existingSpeciality._id.toString() !== req.params.id) {
            return res.status(400).json({ message: 'Speciality with this label already exists' });
        }

        // Update the speciality
        const updatedSpeciality = await Speciality.findByIdAndUpdate(
            req.params.id,
            { 
                label: req.body.label,
                updatedAt: new Date()
            },
            { new: true } // Return the updated document
        );

        if (!updatedSpeciality) {
            return res.status(404).json({ message: 'Speciality not found' });
        }

        res.status(200).json(updatedSpeciality);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete speciality by ID
exports.deleteSpeciality = async (req, res) => {
    try {
        const speciality = await Speciality.findByIdAndDelete(req.params.id);

        if (!speciality) {
            return res.status(404).json({ message: 'Speciality not found' });
        }

        res.status(200).json({ message: 'Speciality deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
