const express = require('express');
const userController = require('../controllers/userController');
const upload = require('../middlewares/upload')

const router = express.Router();

/**
 * @swagger
 * /api/v1/user:
 *   post:
 *     summary: Register a new user (Doctor or Patient)
 *     description: Creates a new user and associates them with a Doctor or Patient entity based on the request data.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 example: "65f123456789abcd12345678" # Role ObjectId
 *               doctorData:
 *                 type: object
 *                 nullable: true
 *                 properties:
 *                   speciality_ids:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["65f987654321abcd12345678"]
 *                   experience:
 *                     type: number
 *                     example: 5
 *                   office_Adresse:
 *                     type: string
 *                     example: "123 Medical St, New York"
 *                   phone_number:
 *                     type: string
 *                     example: "+123456789"
 *                   location:
 *                     type: string
 *                     example: "Rabat"
 *                   placement:
 *                     type: string
 *                     example: "hay riyad , avuenue ennakhil"
 *               patientData:
 *                 type: object
 *                 nullable: true
 *                 properties:
 *                   birth_date:
 *                     type: string
 *                     format: date
 *                     example: "1990-01-01"
 *                   gender:
 *                     type: string
 *                     enum: ["Male", "Female"]
 *                     example: "Male"
 *                   Adresse:
 *                     type: string
 *                     example: "456 Patient Ave, Los Angeles"
 *                   phone_number:
 *                     type: string
 *                     example: "+987654321"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 user:
 *                   type: object
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
router.post('/', userController.registerUser);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   put:
 *     summary: Update a user
 *     description: Updates a user's details and optionally updates associated doctor or patient information.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "John Updated"
 *               doctorData:
 *                 type: object
 *                 nullable: true
 *                 properties:
 *                   experience:
 *                     type: number
 *                     example: 7
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/:id', userController.updateUser);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user along with their associated doctor or patient records if they exist.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', userController.deleteUser);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieves a single user by their ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all users.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Server error
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /api/v1/user/role/{roleId}:
 *   get:
 *     summary: Get users by role ID
 *     description: Retrieves all users that belong to a specific role.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     responses:
 *       200:
 *         description: List of users with the specified role
 *       500:
 *         description: Server error
 */
router.get('/role/:roleId', userController.getUsersByRole);




/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Authenticate user and return token
 *     description: Logs in a user with email and password, returning user details, role, and associated doctor or patient information.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65a2b0f4c3a1a7f6e2d12345"
 *                     first_name:
 *                       type: string
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     role:
 *                       type: string
 *                       example: "doctor"
 *                     doctorInfo:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "65a2b0f4c3a1a7f6e2d67890"
 *                         specialty:
 *                           type: string
 *                           example: "Cardiologist"
 *                         experience:
 *                           type: number
 *                           example: 10
 *                     patientInfo:
 *                       type: object
 *                       nullable: true
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
router.post('/login', userController.loginUser);

/**
 * @swagger
 * /api/v1/user/getAllUsersBySpecificRole/{role}:
 *   get:
 *     summary: Get all users with a specific role (doctor or patient)
 *     description: Retrieves users who have the role "Docteur" or "Patient"
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         description: Role of the user to fetch (either 'doctor' or 'patient')
 *         schema:
 *           type: string
 *           enum: [doctor, patient]
 *     responses:
 *       200:
 *         description: A list of users with the specified role
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: User's unique identifier
 *                   first_name:
 *                     type: string
 *                     description: User's first name
 *                   last_name:
 *                     type: string
 *                     description: User's last name
 *                   email:
 *                     type: string
 *                     description: User's email address
 *                   role:
 *                     type: string
 *                     description: User's role (e.g., Docteur, Patient)
 *                   doctorInfo:
 *                     type: object
 *                     description: Doctor-related information if the user is a doctor
 *                   patientInfo:
 *                     type: object
 *                     description: Patient-related information if the user is a patient
 *       400:
 *         description: Invalid role provided (must be 'doctor' or 'patient')
 *       404:
 *         description: No users found with the specified role
 *       500:
 *         description: Internal server error
 */

// Route to get users by specific role: doctor or patient
router.get('/getAllUsersBySpecificRole/:role', userController.getUsersBySpecificRole);

router.get('/stats/stats', userController.getAllStats);


router.get('/getSpecialitiesByDoctorId/:id', userController.getDoctorSpecialities);

router.put("/updateDoctorSpeciality/:doctorId", userController.updateDoctorSpeciality);

router.put("/doctors/:id/image", upload.single("image"), userController.updateDoctorImage);
router.get("/doctors/:id/image", userController.getDoctorImage);

router.post('/forgotPassword', userController.forgotPassword)
router.post("/resetPassword", userController.resetPassword);

module.exports = router;
