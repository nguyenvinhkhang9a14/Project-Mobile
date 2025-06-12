const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./Models");

// Import routes
const authRoutes = require("./Routes/auth");
const userRoutes = require("./Routes/users");
const doctorRoutes = require("./Routes/doctors");
const bookingRoutes = require("./Routes/bookings");
const specialtyRoutes = require("./Routes/specialties");
const clinicRoutes = require("./Routes/clinics");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/doctors", doctorRoutes);
app.use("/bookings", bookingRoutes);
app.use("/specialties", specialtyRoutes);
app.use("/clinics", clinicRoutes);
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Medical Booking API" });
});

const PORT = process.env.PORT || 5000;

db.sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });
