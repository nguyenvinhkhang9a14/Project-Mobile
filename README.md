# Medical Booking App

A mobile application for booking medical appointments with doctors.

## Project Structure

- `back end/` - Backend Node.js server with Express and Sequelize
- `MedicalBookingApp/` - React Native mobile application

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd "back end"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your database:
   - Create a MySQL database named `mobile`
   - Update database connection settings in `back end/Models/index.js` if needed

4. Start the server:
   ```bash
   npm start
   ```

5. Seed the database with sample data:
   ```bash
   node runSeeds.js
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd MedicalBookingApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Metro bundler:
   ```bash
   npm start
   ```

4. Run the app on Android:
   ```bash
   npm run android
   ```

   Or on iOS:
   ```bash
   npm run ios
   ```

## Sample Users

After running the seed script, the following users will be available:

### Admin
- Email: admin@example.com
- Password: admin123

### Patients
- Email: patient1@example.com
- Password: patient123

- Email: patient2@example.com
- Password: patient123

### Doctors
- Email: doctor1@example.com
- Password: doctor123

- Email: doctor2@example.com
- Password: doctor123

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user profile

### Doctors
- `GET /doctors` - Get all doctors
- `GET /doctors/:id` - Get doctor by ID
- `GET /doctors/specialty/:specialtyId` - Get doctors by specialty
- `GET /doctors/:id/schedule` - Get doctor's schedule

### Bookings
- `GET /bookings` - Get user's bookings
- `POST /bookings` - Create a new booking
- `GET /bookings/:id` - Get booking details
- `PUT /bookings/:id` - Update booking
- `POST /bookings/cancel/:id` - Cancel booking
- `POST /bookings/reschedule/:id` - Reschedule booking

### Specialties
- `GET /specialties` - Get all specialties
- `GET /specialties/:id` - Get specialty by ID

### Clinics
- `GET /clinics` - Get all clinics
- `GET /clinics/:id` - Get clinic by ID

## Troubleshooting

If you encounter 404 errors when making API requests, ensure:
1. The backend server is running
2. The API endpoints in `MedicalBookingApp/config.ts` match the backend routes
3. For Android emulator, make sure the API_URL is set to `http://10.0.2.2:5000`
4. For iOS simulator, use `http://localhost:5000` 