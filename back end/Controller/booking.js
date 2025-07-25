const db = require("../Models");
const Booking = db.booking;
const Clinic = db.clinic; // nếu chưa import
const emailService = require("../Service/emailService"); // <-- đường dẫn tới file bạn vừa tạo
const User = db.user;
const Doctor = db.doctor;
require("dotenv").config();

// Create a new booking
exports.create = async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      patientId: req.user.userId,
    };

    const booking = await Booking.create(bookingData);

    const patient = await User.findByPk(req.user.userId);
    const doctor = await Doctor.findByPk(booking.doctorId);
    const clinic = await Clinic.findByPk(doctor.clinicId);

    await emailService.sendBookingConfirmation(patient.email, {
      firstname: patient.firstname,
      lastname: patient.lastname,
      doctorName: `${doctor.firstname} ${doctor.lastname}`,
      nameClinic: clinic.nameClinic,
      addressClinic: clinic.addressClinic,
      date: booking.date,
      timeType: booking.timeType,
      symptomDescription: booking.symptomDescription,
    });

    return res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
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
          as: "doctor",
          include: [
            {
              model: db.specialty,
              as: "specialty",
            },
            {
              model: db.clinic,
              as: "clinic",
            },
          ],
        },
        {
          model: db.user,
          as: "patient",
          attributes: [
            "userId",
            "firstname",
            "lastname",
            "email",
            "phoneNumber",
          ],
        },
      ],
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
          as: "doctor",
          include: [
            {
              model: db.specialty,
              as: "specialty",
            },
            {
              model: db.clinic,
              as: "clinic",
            },
          ],
        },
        {
          model: db.user,
          as: "patient",
          attributes: [
            "userId",
            "firstname",
            "lastname",
            "email",
            "phoneNumber",
          ],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
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
      where: { bookingId: req.params.id },
    });

    if (numUpdated[0] === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ message: "Booking updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete booking
exports.delete = async (req, res) => {
  try {
    const numDeleted = await Booking.destroy({
      where: { bookingId: req.params.id },
    });

    if (numDeleted === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ message: "Booking deleted successfully" });
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
          as: "doctor",
          required: false, // Cho phép doctor null
          include: [
            { model: db.specialty, as: "specialty", required: false },
            { model: db.clinic, as: "clinic", required: false },
          ],
        },
      ],
      order: [
        ["date", "ASC"],
        ["timeType", "ASC"],
      ],
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error in getMyBookings:", error); // Thêm log chi tiết
    return res.status(500).json({ message: error.message });
  }
};

// Update booking status (confirm, cancel, etc.)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    // Map chuỗi status sang số
    const statusMap = {
      pending: 0,
      confirmed: 1,
      completed: 2,
      canceled: 3,
    };
    if (!status || !(status in statusMap)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    // Kiểm tra quyền: chỉ admin, doctor, hoặc chính bệnh nhân mới được phép
    if (
      req.user.role !== "admin" &&
      req.user.role !== "doctor" &&
      req.user.userId !== booking.patientId
    ) {
      return res.status(403).json({ message: "You are not authorized to update this booking" });
    }
    // Update the booking status
    booking.status = statusMap[status];
    await booking.save();
    return res.status(200).json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Reschedule a booking
exports.reschedule = async (req, res) => {
  try {
    const { date, timeType, symptomDescription } = req.body;

    console.log('[RESCHEDULE] Body:', req.body);

    if (!date || !timeType) {
      return res.status(400).json({ message: "Date and timeType are required" });
    }

    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log('[RESCHEDULE] Booking before update:', booking.toJSON());

    // Check if user is authorized to reschedule this booking
    if (req.user.role !== "admin" && req.user.userId !== booking.patientId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to reschedule this booking" });
    }

    // Update the booking date, timeType, and symptomDescription
    booking.date = date;
    booking.timeType = timeType;
    if (typeof symptomDescription !== 'undefined') {
      booking.symptomDescription = symptomDescription;
    }
    booking.status = 0; // 0 = pending
    await booking.save();

    console.log('[RESCHEDULE] Booking after update:', booking.toJSON());

    // Gửi lại email xác nhận nếu cần (kiểm tra null trước)
    try {
      const patient = await User.findByPk(booking.patientId);
      const doctor = await Doctor.findByPk(booking.doctorId);
      let clinic = null;
      if (doctor) {
        clinic = await Clinic.findByPk(doctor.clinicId);
      }
      if (patient && doctor && clinic) {
        await emailService.sendBookingConfirmation(patient.email, {
          firstname: patient.firstname,
          lastname: patient.lastname,
          doctorName: `${doctor.firstname} ${doctor.lastname}`,
          nameClinic: clinic.nameClinic,
          addressClinic: clinic.addressClinic,
          date: booking.date,
          timeType: booking.timeType,
          symptomDescription: booking.symptomDescription,
        });
      } else {
        console.warn("Không thể gửi email xác nhận: thiếu thông tin patient, doctor hoặc clinic");
      }
    } catch (emailError) {
      console.error("Lỗi khi gửi email xác nhận đổi lịch:", emailError);
    }

    return res.status(201).json(booking);
  } catch (error) {
    console.error("Error in reschedule:", error); // Log chi tiết lỗi
    return res.status(500).json({ message: error.message });
  }
};

// Add review for completed booking
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Valid rating (1-5) is required" });
    }

    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is authorized to review this booking
    if (req.user.userId !== booking.patientId) {
      return res
        .status(403)
        .json({ message: "You can only review your own bookings" });
    }

    // Check if booking is completed
    if (booking.status !== "completed") {
      return res
        .status(400)
        .json({ message: "You can only review completed appointments" });
    }

    // Update the booking with review data
    booking.rating = rating;
    booking.review = comment;
    booking.reviewedAt = new Date();
    await booking.save();

    return res.status(200).json({
      message: "Review added successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get bookings for the current doctor
exports.getDoctorBookings = async (req, res) => {
  try {
    // First get the doctor profile for the current user
    const doctorProfile = await db.doctor.findOne({
      where: { userId: req.user.userId },
    });

    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const bookings = await Booking.findAll({
      where: { doctorId: doctorProfile.doctorId },
      include: [
        {
          model: db.user,
          as: "patient",
          attributes: [
            "userId",
            "firstname",
            "lastname",
            "email",
            "phoneNumber",
          ],
        },
      ],
      order: [
        ["date", "ASC"],
        ["timeType", "ASC"],
      ],
    });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
