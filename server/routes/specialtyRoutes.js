const express = require('express');
const router = express.Router();
const specialityController = require('../controllers/specialityController');

// Swagger documentation for routes

/**
 * @swagger
 * /api/v1/speciality:
 *   post:
 *     summary: Create a new speciality
 *     description: Creates a new speciality with a unique label
 *     tags: [Speciality]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 description: The name/label of the speciality
 *                 example: "Cardiology"
 *     responses:
 *       201:
 *         description: Speciality created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Speciality'
 *       400:
 *         description: Speciality label already exists
 *       500:
 *         description: Server error
 */
router.post('/', specialityController.createSpeciality);

/**
 * @swagger
 * /api/v1/speciality:
 *   get:
 *     summary: Get all specialities
 *     description: Fetches all specialities from the database
 *     tags: [Speciality]
 *     responses:
 *       200:
 *         description: A list of specialities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Speciality'
 *       500:
 *         description: Server error
 */
router.get('/', specialityController.getAllSpecialities);

/**
 * @swagger
 * /api/v1/speciality/{id}:
 *   get:
 *     summary: Get a speciality by ID
 *     description: Fetch a speciality by its unique ID
 *     tags: [Speciality]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The speciality ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single speciality
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Speciality'
 *       404:
 *         description: Speciality not found
 *       500:
 *         description: Server error
 */
router.get('/:id', specialityController.getSpecialityById);

/**
 * @swagger
 * /api/v1/speciality/{id}:
 *   put:
 *     summary: Update a speciality by ID
 *     description: Updates the speciality label, ensuring it remains unique
 *     tags: [Speciality]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The speciality ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 description: The updated speciality label
 *                 example: "Neurology"
 *     responses:
 *       200:
 *         description: Speciality updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Speciality'
 *       400:
 *         description: Speciality label already exists
 *       404:
 *         description: Speciality not found
 *       500:
 *         description: Server error
 */
router.put('/:id', specialityController.updateSpeciality);

/**
 * @swagger
 * /api/v1/speciality/{id}:
 *   delete:
 *     summary: Delete a speciality by ID
 *     description: Deletes the speciality based on the given ID
 *     tags: [Speciality]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The speciality ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Speciality deleted successfully
 *       404:
 *         description: Speciality not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', specialityController.deleteSpeciality);

module.exports = router;
