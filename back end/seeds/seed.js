const bcrypt = require('bcryptjs');
const db = require('../Models');
const User = db.user;
const Doctor = db.doctor;
const Specialty = db.specialty;
const Clinic = db.clinic;
const Booking = db.booking;

// Function to hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Seed function
const seed = async () => {
  try {
    console.log('Starting database seeding...');

    // Create specialties
    const specialties = await Specialty.bulkCreate([
      {
        nameSpecialty: 'Cardiology',
        description: 'Deals with disorders of the heart and blood vessels'
      },
      {
        nameSpecialty: 'Dermatology',
        description: 'Focuses on conditions affecting the skin, hair, and nails'
      },
      {
        nameSpecialty: 'Neurology',
        description: 'Treats disorders of the nervous system'
      },
      {
        nameSpecialty: 'Orthopedics',
        description: 'Focuses on the musculoskeletal system'
      },
      {
        nameSpecialty: 'Pediatrics',
        description: 'Medical care for infants, children, and adolescents'
      }
    ]);
    console.log('Specialties created');

    // Create clinics
    const clinics = await Clinic.bulkCreate([
      {
        nameClinic: 'City Medical Center',
        address: '123 Main St, City'
      },
      {
        nameClinic: 'Riverside Hospital',
        address: '456 River Rd, Riverside'
      },
      {
        nameClinic: 'Mountain View Clinic',
        address: '789 Mountain Ave, Mountain View'
      }
    ]);
    console.log('Clinics created');

    // Create admin user
    const adminPassword = await hashPassword('admin123');
    const admin = await User.create({
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      firstname: 'Admin',
      lastname: 'User',
      phoneNumber: '123-456-7890',
      address: 'Admin Address',
      gender: 'Other',
      age: 35
    });
    console.log('Admin user created');

    // Create patient users
    const patientPassword = await hashPassword('patient123');
    const patients = await User.bulkCreate([
      {
        email: 'patient1@example.com',
        password: patientPassword,
        role: 'patient',
        firstname: 'John',
        lastname: 'Doe',
        phoneNumber: '111-222-3333',
        address: '123 Patient St',
        gender: 'Male',
        age: 30
      },
      {
        email: 'patient2@example.com',
        password: patientPassword,
        role: 'patient',
        firstname: 'Jane',
        lastname: 'Smith',
        phoneNumber: '444-555-6666',
        address: '456 Patient Ave',
        gender: 'Female',
        age: 25
      }
    ]);
    console.log('Patient users created');

    // Create doctor users and profiles
    const doctorPassword = await hashPassword('doctor123');
    
    // Doctor 1
    const doctor1User = await User.create({
      email: 'doctor1@example.com',
      password: doctorPassword,
      role: 'doctor',
      firstname: 'Robert',
      lastname: 'Johnson',
      phoneNumber: '777-888-9999',
      address: '789 Doctor Blvd',
      gender: 'Male',
      age: 45
    });
    
    await Doctor.create({
      userId: doctor1User.userId,
      email: doctor1User.email,
      firstname: doctor1User.firstname,
      lastname: doctor1User.lastname,
      description: 'Experienced cardiologist with 15 years of practice',
      bioHTML: '<p>Dr. Robert Johnson is a board-certified cardiologist with extensive experience in treating heart conditions.</p>',
      specialtyId: specialties[0].id, // Cardiology
      clinicId: clinics[0].id // City Medical Center
    });
    
    // Doctor 2
    const doctor2User = await User.create({
      email: 'doctor2@example.com',
      password: doctorPassword,
      role: 'doctor',
      firstname: 'Sarah',
      lastname: 'Williams',
      phoneNumber: '111-222-3333',
      address: '101 Doctor St',
      gender: 'Female',
      age: 38
    });
    
    await Doctor.create({
      userId: doctor2User.userId,
      email: doctor2User.email,
      firstname: doctor2User.firstname,
      lastname: doctor2User.lastname,
      description: 'Specialized dermatologist focusing on skin conditions',
      bioHTML: '<p>Dr. Sarah Williams is a dermatologist with expertise in treating various skin conditions and performing cosmetic procedures.</p>',
      specialtyId: specialties[1].id, // Dermatology
      clinicId: clinics[1].id // Riverside Hospital
    });
    
    console.log('Doctor users and profiles created');

    // Create bookings
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    await Booking.bulkCreate([
      {
        status: 1, // confirmed
        doctorId: 1, // First doctor
        patientId: patients[0].userId, // First patient
        date: tomorrow.toISOString().split('T')[0],
        timeType: 'morning',
        symptomDescription: 'Chest pain and shortness of breath'
      },
      {
        status: 0, // pending
        doctorId: 2, // Second doctor
        patientId: patients[1].userId, // Second patient
        date: nextWeek.toISOString().split('T')[0],
        timeType: 'afternoon',
        symptomDescription: 'Skin rash and itching'
      }
    ]);
    
    console.log('Bookings created');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Execute the seed function if this script is run directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seeding completed, exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seed;
