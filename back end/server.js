const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./Models');

// Import routes
const authRoutes = require('./Routes/auth');
const userRoutes = require('./Routes/users');
const doctorRoutes = require('./Routes/doctors');
const bookingRoutes = require('./Routes/bookings');
const specialtyRoutes = require('./Routes/specialties');
const clinicRoutes = require('./Routes/clinics');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/doctors', doctorRoutes);
app.use('/bookings', bookingRoutes);
app.use('/specialties', specialtyRoutes);
app.use('/clinics', clinicRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Medical Booking API' });
});

// Set port
const PORT = process.env.PORT || 5000;

// Sync database and start server
db.sequelize.sync()
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });
