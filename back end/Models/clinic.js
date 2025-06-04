module.exports = (sequelize, DataTypes) => {
  const Clinic = sequelize.define("clinic", {
    clinicId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nameClinic: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addressClinic: {
      type: DataTypes.STRING
    }
  });

  Clinic.associate = (models) => {
    Clinic.hasMany(models.doctor, {
      foreignKey: 'clinicId',
      as: 'doctors'
    });
  };

  return Clinic;
}; 