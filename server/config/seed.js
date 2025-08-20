const connectDb = require("./connectDB");
const Role = require("../models/rolesModel");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const seedRoles = async () => {
  const roles = [{ role: "Admin" }, { role: "Doctor" }, { role: "Patient" }];

  const existingRoles = await Role.find({});
  if (existingRoles.length === 0) {
    await Role.insertMany(roles);
    console.log("✅ Rôles insérés");
  } else {
    console.log("ℹ️ Rôles déjà existants, aucun ajout.");
  }
};

const seedAdminUser = async () => {
  const existingAdmin = await User.findOne({ email: "admin@example.com" });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("hashedpassword", 10);

    const adminUser = {
      first_name: "Admin",
      last_name: "User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "Admin",
    };

    await User.create(adminUser);
    console.log("✅ Admin inséré");
  } else {
    console.log("ℹ️ Admin déjà existant, aucun ajout.");
  }
};

const seedDatabase = async () => {
  try {
    await connectDb();
    console.log("📡 Connecté à MongoDB");

    await seedRoles();
    await seedAdminUser();
  } catch (err) {
    console.error("❌ Erreur lors du seed:", err);
  }
};

module.exports = seedDatabase;
