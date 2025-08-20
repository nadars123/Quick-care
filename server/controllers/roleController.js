const Role = require('../models/rolesModel');

// Create a new role
exports.createRole = async (req, res) => {
    try {
        const { role } = req.body;
        const newRole = new Role({ role });
        await newRole.save();
        res.status(201).json({ message: "Role created successfully", role: newRole });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all roles
exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single role by ID
exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ message: "Role not found" });
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a role by ID
exports.updateRole = async (req, res) => {
    try {
        const { role } = req.body;
        const updatedRole = await Role.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true });
        if (!updatedRole) return res.status(404).json({ message: "Role not found" });
        res.status(200).json({ message: "Role updated successfully", role: updatedRole });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a role by ID
exports.deleteRole = async (req, res) => {
    try {
        const deletedRole = await Role.findByIdAndDelete(req.params.id);
        if (!deletedRole) return res.status(404).json({ message: "Role not found" });
        res.status(200).json({ message: "Role deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
