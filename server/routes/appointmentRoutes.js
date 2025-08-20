const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const router = express.Router();

/**
 * @swagger
 * /api/v1/appointment:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of all appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: number
 *                 data:
 *                   type: object
 *                   properties:
 *                     appointments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Appointment'
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient_id
 *               - doctor_id
 *               - appointment_date
 *               - appointment_time
 *             properties:
 *               patient_id:
 *                 type: string
 *               doctor_id:
 *                 type: string
 *               appointment_date:
 *                 type: string
 *                 format: date
 *               appointment_time:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created successfully
 */
router
  .route("/")
  .get(appointmentController.getAllAppointments)
  .post(appointmentController.createAppointment);

/**
 * @swagger
 * /api/v1/appointment/patient/{id}:
 *   get:
 *     summary: Get appointments by Patient ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: List of appointments for the given patient
 *       400:
 *         description: Invalid patient ID or no appointments found
 */
router.get("/patient/:id", appointmentController.getAppointmentsByPatientID);

/**
 * @swagger
 * /api/v1/appointment/doctor/{id}:
 *   get:
 *     summary: Get appointments by Doctor ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: List of appointments for the given doctor
 *       400:
 *         description: Invalid doctor ID or no appointments found
 */
router.get('/doctor/:id', appointmentController.getAppointmentsByDoctorID);

/**
 * @swagger
 * /api/v1/appointments/{id}:
 *   patch:
 *     summary: Update an appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Appointment ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointment_date:
 *                 type: string
 *                 format: date
 *               appointment_time:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *       404:
 *         description: Appointment not found
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Appointment ID
 *     responses:
 *       204:
 *         description: Appointment deleted successfully
 *       404:
 *         description: Appointment not found
 */
router.patch('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - patient_id
 *         - doctor_id
 *         - appointment_date
 *         - appointment_time
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated appointment ID
 *         patient_id:
 *           type: string
 *           description: Reference to Patient
 *         doctor_id:
 *           type: string
 *           description: Reference to Doctor
 *         appointment_date:
 *           type: string
 *           format: date
 *           description: Date of the appointment
 *         appointment_time:
 *           type: string
 *           description: Time of the appointment
 */

module.exports = router;