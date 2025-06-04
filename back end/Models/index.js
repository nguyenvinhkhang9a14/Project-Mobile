const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.user = require("./user.js")(sequelize, DataTypes);
db.doctor = require("./doctor.js")(sequelize, DataTypes);
db.booking = require("./booking.js")(sequelize, DataTypes);
db.specialty = require("./specialty.js")(sequelize, DataTypes);
db.clinic = require("./clinic.js")(sequelize, DataTypes);

// Set up relationships between models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
