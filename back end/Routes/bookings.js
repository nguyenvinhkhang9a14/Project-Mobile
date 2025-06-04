const express = require('express');
const router = express.Router();
const bookingController = require('../Controller/booking');
const authMiddleware = require('../Middleware/authMiddleware');

// GET /bookings - Get all bookings (admin only)
router.get('/', authMiddleware.authenticateToken, authMiddleware.isAdmin, bookingController.findAll);

// GET /bookings/:id - Get booking by ID (authenticated users)
router.get('/:id', authMiddleware.authenticateToken, bookingController.findOne);

// POST /bookings - Create a new booking (authenticated users)
router.post('/', authMiddleware.authenticateToken, bookingController.create);

// PUT /bookings/:id - Update a booking (authenticated users)
router.put('/:id', authMiddleware.authenticateToken, bookingController.update);

// DELETE /bookings/:id - Delete a booking (authenticated users)
router.delete('/:id', authMiddleware.authenticateToken, bookingController.delete);

// GET /bookings/my-bookings - Get bookings for the current patient
router.get('/my-bookings', authMiddleware.authenticateToken, bookingController.getMyBookings);

// GET /bookings/doctor-bookings - Get bookings for the current doctor
router.get('/doctor-bookings', authMiddleware.authenticateToken, authMiddleware.isDoctor, bookingController.getDoctorBookings);

// PUT /bookings/:id/status - Update booking status (doctor or admin)
router.put('/:id/status', authMiddleware.authenticateToken, authMiddleware.isDoctor, bookingController.updateStatus);

// PUT /bookings/:id/reschedule - Reschedule a booking
router.put('/:id/reschedule', authMiddleware.authenticateToken, bookingController.reschedule);

// POST /bookings/:id/review - Add a review for a completed booking
router.post('/:id/review', authMiddleware.authenticateToken, bookingController.addReview);

module.exports = router; 