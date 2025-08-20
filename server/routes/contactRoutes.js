const express = require("express");
const router = express.Router();

const {
  getAllContacts,
  createContact,
  deleteContact,
} = require("../controllers/contactController");

router.get("/", getAllContacts);
router.post("/", createContact);
router.delete("/:id", deleteContact);

module.exports = router;
