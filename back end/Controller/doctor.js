const db = require("../Models");
const Doctor = db.doctor;
const Specialty = db.specialty;
const Clinic = db.clinic;

// Create a new doctor
exports.create = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      price,
      specialtyId,
      clinicId,
      email,
      description,
    } = req.body;

    const newDoctor = await Doctor.create({
      firstname,
      lastname,
      price,
      specialtyId,
      clinicId,
      email,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    return res.status(201).json(newDoctor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all doctors with their specialty and clinic
exports.findAll = async (req, res) => {
  try {
    // Handle query parameters for filtering
    const { specialtyId, name } = req.query;
    let whereClause = {};

    if (specialtyId) {
      whereClause.specialtyId = specialtyId;
    }

    const doctors = await Doctor.findAll({
      where: whereClause,
      include: [
        {
          model: db.specialty,
          as: "specialty",
        },
        {
          model: db.clinic,
          as: "clinic",
        },
        {
          model: db.user,
          as: "user",
          attributes: ["firstname", "lastname", "email"],
        },
      ],
    });

    // If name filter is provided, filter in memory
    // (This could be moved to the database query for better performance in a real app)
    let filteredDoctors = doctors;
    if (name && name.trim() !== "") {
      const searchName = name.toLowerCase();
      filteredDoctors = doctors.filter((doctor) => {
        const fullName =
          `${doctor.user.firstname} ${doctor.user.lastname}`.toLowerCase();
        return fullName.includes(searchName);
      });
    }

    return res.status(200).json(filteredDoctors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get doctor by ID with specialty and clinic
exports.findOne = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [
        {
          model: db.specialty,
          as: "specialty",
        },
        {
          model: db.clinic,
          as: "clinic",
        },
        {
          model: db.user,
          as: "user",
          attributes: ["firstname", "lastname", "email", "phoneNumber"],
        },
      ],
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json(doctor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update doctor
exports.update = async (req, res) => {
  try {
    const doctorId = req.params.id;

    const updateData = { ...req.body };

    // Nếu có file ảnh được upload
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const [updated] = await Doctor.update(updateData, {
      where: { doctorId },
    });

    if (updated === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json({ message: "Doctor updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Delete doctor
exports.delete = async (req, res) => {
  try {
    const numDeleted = await Doctor.destroy({
      where: { doctorId: req.params.id },
    });

    if (numDeleted === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get doctors by specialty
exports.getDoctorsBySpecialty = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      where: { specialtyId: req.params.specialtyId },
      include: [
        {
          model: db.specialty,
          as: "specialty",
        },
        {
          model: db.clinic,
          as: "clinic",
        },
        {
          model: db.user,
          as: "user",
          attributes: ["firstname", "lastname", "email"],
        },
      ],
    });

    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get doctors by clinic
exports.getDoctorsByClinic = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      where: { clinicId: req.params.clinicId },
      include: [
        {
          model: db.specialty,
          as: "specialty",
        },
        {
          model: db.clinic,
          as: "clinic",
        },
        {
          model: db.user,
          as: "user",
          attributes: ["firstname", "lastname", "email"],
        },
      ],
    });

    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get current doctor's profile
exports.getMyProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      where: { userId: req.user.userId },
      include: [
        {
          model: db.specialty,
          as: "specialty",
        },
        {
          model: db.clinic,
          as: "clinic",
        },
        {
          model: db.user,
          as: "user",
          attributes: ["firstname", "lastname", "email", "phoneNumber"],
        },
      ],
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    return res.status(200).json(doctor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get doctor's schedule
exports.getDoctorSchedule = async (req, res) => {
  try {
    const { date } = req.query;
    const doctorId = req.params.id;

    // First, check if the doctor exists
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Get the doctor's availability settings
    const availability = doctor.availability || {
      monday: { available: true, slots: ["morning", "afternoon"] },
      tuesday: { available: true, slots: ["morning", "afternoon"] },
      wednesday: { available: true, slots: ["morning", "afternoon"] },
      thursday: { available: true, slots: ["morning", "afternoon"] },
      friday: { available: true, slots: ["morning", "afternoon"] },
      saturday: { available: false, slots: [] },
      sunday: { available: false, slots: [] },
    };

    // Get existing bookings for the doctor on the specified date
    let bookings = [];
    if (date) {
      bookings = await db.booking.findAll({
        where: {
          doctorId,
          date,
          status: ["confirmed", "pending"],
        },
        attributes: ["time", "status"],
      });
    }

    // Determine which day of the week the requested date is
    let dayOfWeek = "";
    if (date) {
      const dateObj = new Date(date);
      const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      dayOfWeek = days[dateObj.getDay()];
    }

    // Combine availability and bookings to create schedule
    const schedule = {
      availability: availability,
      bookedSlots: bookings.map((booking) => ({
        time: booking.time,
        status: booking.status,
      })),
      dayOfWeek: dayOfWeek,
    };

    return res.status(200).json(schedule);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update doctor's availability
exports.updateAvailability = async (req, res) => {
  try {
    const { schedule } = req.body;

    if (!schedule) {
      return res.status(400).json({ message: "Schedule data is required" });
    }

    // Find the doctor profile for the current user
    const doctor = await Doctor.findOne({
      where: { userId: req.user.userId },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    // Update the availability field
    doctor.availability = schedule;
    await doctor.save();

    return res.status(200).json({
      message: "Availability updated successfully",
      availability: doctor.availability,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
