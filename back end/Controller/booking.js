const db = require('../Models');
const Booking = db.booking;

// Create a new booking
exports.create = async (req, res) => {
  try {
    // Set the patient ID from the authenticated user
    const bookingData = {
      ...req.body,
      patientId: req.user.userId
    };
    
    const booking = await Booking.create(bookingData);
    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all bookings
exports.findAll = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: db.doctor,
          as: 'doctor',
          include: [
            {
              model: db.specialty,
              as: 'specialty'
            },
            {
              model: db.clinic,
              as: 'clinic'
            }
          ]
        },
        {
          model: db.user,
          as: 'patient',
          attributes: ['userId', 'firstname', 'lastname', 'email', 'phoneNumber']
        }
      ]
    });
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get booking by ID
exports.findOne = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: db.doctor,
          as: 'doctor',
          include: [
            {
              model: db.specialty,
              as: 'specialty'
            },
            {
              model: db.clinic,
              as: 'clinic'
            }
          ]
        },
        {
          model: db.user,
          as: 'patient',
          attributes: ['userId', 'firstname', 'lastname', 'email', 'phoneNumber']
        }
      ]
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update booking
exports.update = async (req, res) => {
  try {
    const numUpdated = await Booking.update(req.body, {
      where: { bookingId: req.params.id }
    });
    
    if (numUpdated[0] === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    return res.status(200).json({ message: 'Booking updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete booking
exports.delete = async (req, res) => {
  try {
    const numDeleted = await Booking.destroy({
      where: { bookingId: req.params.id }
    });
    
    if (numDeleted === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    return res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get bookings for the current patient
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { patientId: req.user.userId },
      include: [
        {
          model: db.doctor,
          as: 'doctor',
          include: [
            {
              model: db.specialty,
              as: 'specialty'
            },
            {
              model: db.clinic,
              as: 'clinic'
            }
          ]
        }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get bookings for the current doctor
exports.getDoctorBookings = async (req, res) => {
  try {
    // First get the doctor profile for the current user
    const doctorProfile = await db.doctor.findOne({
      where: { userId: req.user.userId }
    });
    
    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    
    const bookings = await Booking.findAll({
      where: { doctorId: doctorProfile.doctorId },
      include: [
        {
          model: db.user,
          as: 'patient',
          attributes: ['userId', 'firstname', 'lastname', 'email', 'phoneNumber']
        }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update booking status (confirm, cancel, etc.)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['confirmed', 'canceled', 'completed', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided' });
    }
    
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Update the booking status
    booking.status = status;
    await booking.save();
    
    return res.status(200).json({ 
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Reschedule a booking
exports.reschedule = async (req, res) => {
  try {
    const { date, time } = req.body;
    
    if (!date || !time) {
      return res.status(400).json({ message: 'Date and time are required' });
    }
    
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is authorized to reschedule this booking
    if (req.user.role !== 'admin' && req.user.userId !== booking.patientId) {
      return res.status(403).json({ message: 'You are not authorized to reschedule this booking' });
    }
    
    // Update the booking date and time
    booking.date = date;
    booking.time = time;
    booking.status = 'pending'; // Reset status to pending after rescheduling
    await booking.save();
    
    return res.status(200).json({ 
      message: 'Booking rescheduled successfully',
      booking
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Add review for completed booking
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Valid rating (1-5) is required' });
    }
    
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is authorized to review this booking
    if (req.user.userId !== booking.patientId) {
      return res.status(403).json({ message: 'You can only review your own bookings' });
    }
    
    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review completed appointments' });
    }
    
    // Update the booking with review data
    booking.rating = rating;
    booking.review = comment;
    booking.reviewedAt = new Date();
    await booking.save();
    
    return res.status(200).json({ 
      message: 'Review added successfully',
      booking
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}; 