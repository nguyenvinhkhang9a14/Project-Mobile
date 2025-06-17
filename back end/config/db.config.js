module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "xuanhuan2003@",
  DB: "mobile",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
