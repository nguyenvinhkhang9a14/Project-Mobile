const express = require('express');
const router = express.Router();
const clinicController = require('../Controller/clinic');
const authMiddleware = require('../Middleware/authMiddleware');

// Get all clinics 
router.get('/', clinicController.findAll);

//  Get clinic by ID 
router.get('/:id', clinicController.findOne);

// Create a new clinic 
router.post('/', authMiddleware.authenticateToken, authMiddleware.isAdmin, clinicController.create);

// Update a clinic 
router.put('/:id', authMiddleware.authenticateToken, authMiddleware.isAdmin, clinicController.update);

//  Delete a clinic 
router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.isAdmin, clinicController.delete);

module.exports = router; 