const express = require('express');
const router = express.Router();
const clinicController = require('../Controller/clinic');
const authMiddleware = require('../Middleware/authMiddleware');

// GET /api/clinics - Get all clinics (public)
router.get('/', clinicController.findAll);

// GET /api/clinics/:id - Get clinic by ID (public)
router.get('/:id', clinicController.findOne);

// POST /api/clinics - Create a new clinic (admin only)
router.post('/', authMiddleware.authenticateToken, authMiddleware.isAdmin, clinicController.create);

// PUT /api/clinics/:id - Update a clinic (admin only)
router.put('/:id', authMiddleware.authenticateToken, authMiddleware.isAdmin, clinicController.update);

// DELETE /api/clinics/:id - Delete a clinic (admin only)
router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.isAdmin, clinicController.delete);

module.exports = router; 