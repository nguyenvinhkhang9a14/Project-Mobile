module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define("booking", {
    bookingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // 0: pending, 1: confirmed, 2: completed, 3: canceled
    },
    doctorId: {
      type: DataTypes.INTEGER
    },
    patientId: {
      type: DataTypes.INTEGER
    },
    date: {
      type: DataTypes.STRING
    },
    timeType: {
      type: DataTypes.STRING
    },
    symptomDescription: {
      type: DataTypes.TEXT
    },
    consultationNote: {
      type: DataTypes.TEXT('long')
    }
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.doctor, {
      foreignKey: 'doctorId',
      as: 'doctor',
    });
    
    // Patient is actually a user with role='patient'
    Booking.belongsTo(models.user, {
      foreignKey: 'patientId',
      as: 'patient'
    });
  };

  return Booking;
}; 