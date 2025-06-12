
const express = require('express');
const router = express.Router();
const bookingController = require('../Controller/booking');
const authMiddleware = require('../Middleware/authMiddleware');


//  Get bookings for the current patient
router.get('/my-bookings', authMiddleware.authenticateToken, bookingController.getMyBookings);

//  Get bookings for the current doctor
router.get('/doctor-bookings', authMiddleware.authenticateToken, authMiddleware.isDoctor, bookingController.getDoctorBookings);

//Get all bookings
router.get('/', authMiddleware.authenticateToken, authMiddleware.isAdmin, bookingController.findAll);

//Get booking by ID 
router.get('/:id', authMiddleware.authenticateToken, bookingController.findOne);

// Create a new booking 
router.post('/', authMiddleware.authenticateToken, bookingController.create);

//Update a booking 
router.put('/:id', authMiddleware.authenticateToken, bookingController.update);

// Delete a booking 
router.delete('/:id', authMiddleware.authenticateToken, bookingController.delete);

// Update booking status 
router.put('/:id/status', authMiddleware.authenticateToken, bookingController.updateStatus);

// - Reschedule a booking
router.put('/:id/reschedule', authMiddleware.authenticateToken, bookingController.reschedule);

// Add a review for a completed booking
router.post('/:id/review', authMiddleware.authenticateToken, bookingController.addReview);

module.exports = router;