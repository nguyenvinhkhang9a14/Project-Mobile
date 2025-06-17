module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define("doctor", {
    doctorId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    bioHTML: {
      type: DataTypes.TEXT("long"),
    },
    specialtyId: {
      type: DataTypes.INTEGER,
    },
    clinicId: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.INTEGER,
    },
  });

  Doctor.associate = (models) => {
    Doctor.hasMany(models.booking, {
      foreignKey: "doctorId",
      as: "bookings",
    });

    Doctor.belongsTo(models.specialty, {
      foreignKey: "specialtyId",
      as: "specialty",
    });

    Doctor.belongsTo(models.clinic, {
      foreignKey: "clinicId",
      as: "clinic",
    });

    Doctor.belongsTo(models.user, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Doctor;
};
