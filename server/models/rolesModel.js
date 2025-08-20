const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    role: { type: String, required: true, unique: true },
    updatedAt : { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
})

const Role = mongoose.model('Role', roleSchema);   

module.exports = Role;