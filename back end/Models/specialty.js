module.exports = (sequelize, DataTypes) => {
  const Specialty = sequelize.define("specialty", {
    specialtyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nameSpecialty: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  });

  Specialty.associate = (models) => {
    Specialty.hasMany(models.doctor, {
      foreignKey: 'specialtyId',
      as: 'doctors'
    });
  };

  return Specialty;
}; 