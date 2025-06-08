const express = require("express");
const router = express.Router();
const multer = require("multer"); // Thêm dòng này
const doctorController = require("../Controller/doctor");
const authMiddleware = require("../Middleware/authMiddleware");

// Cấu hình lưu trữ ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Đảm bảo thư mục này tồn tại
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }); // Và dòng này

// GET /doctors - Get all doctors (public)
router.get("/", doctorController.findAll);

// GET /doctors/:id - Get doctor by ID (public)
router.get("/:id", doctorController.findOne);

// POST /doctors - Create a new doctor (admin only)
router.post(
  "/",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  upload.single("image"),
  doctorController.create
);

// PUT /doctors/:id - Update a doctor (admin only)
router.put(
  "/:id",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  upload.single("image"),
  doctorController.update
);

// DELETE /doctors/:id - Delete a doctor (admin only)
router.delete(
  "/:id",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  doctorController.delete
);

// GET /doctors/specialty/:specialtyId - Get doctors by specialty (public)
router.get("/specialty/:specialtyId", doctorController.getDoctorsBySpecialty);

// GET /doctors/clinic/:clinicId - Get doctors by clinic (public)
router.get("/clinic/:clinicId", doctorController.getDoctorsByClinic);

// GET /doctors/profile - Get current doctor's profile (doctor only)
router.get(
  "/profile",
  authMiddleware.authenticateToken,
  authMiddleware.isDoctor,
  doctorController.getMyProfile
);

// GET /doctors/:id/schedule - Get doctor's schedule (public)
router.get("/:id/schedule", doctorController.getDoctorSchedule);

// PUT /doctors/availability - Update doctor's availability (doctor only)
router.put(
  "/availability",
  authMiddleware.authenticateToken,
  authMiddleware.isDoctor,
  doctorController.updateAvailability
);

module.exports = router;
