const Contact = require("../models/contactModel");

// Get all contacts
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

// Create a new contact
const createContact = async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json(newContact);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to create contact", details: err.message });
  }
};

// Delete one contact by ID
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete contact" });
  }
};

module.exports = {
  getAllContacts,
  createContact,
  deleteContact,
};
