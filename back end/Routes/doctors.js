const express = require("express");
const router = express.Router();
const multer = require("multer"); 
const doctorController = require("../Controller/doctor");
const authMiddleware = require("../Middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }); 

// Get all doctors 
router.get("/", doctorController.findAll);

// Get doctor by ID 
router.get("/:id", doctorController.findOne);

// Create a new doctor 
router.post(
  "/",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  upload.single("image"),
  doctorController.create
);

// Update a doctor 
router.put(
  "/:id",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  upload.single("image"),
  doctorController.update
);

//  Delete a doctor 
router.delete(
  "/:id",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  doctorController.delete
);

//  Get doctors by specialty 
router.get("/specialty/:specialtyId", doctorController.getDoctorsBySpecialty);

//  Get doctors by clinic 
router.get("/clinic/:clinicId", doctorController.getDoctorsByClinic);

//Get current doctor's profile (doctor only)
router.get(
  "/profile",
  authMiddleware.authenticateToken,
  authMiddleware.isDoctor,
  doctorController.getMyProfile
);

//  Get doctor's schedule 
router.get("/:id/schedule", doctorController.getDoctorSchedule);

//  Update doctor's availability (doctor only)
router.put(
  "/availability",
  authMiddleware.authenticateToken,
  authMiddleware.isDoctor,
  doctorController.updateAvailability
);

module.exports = router;
