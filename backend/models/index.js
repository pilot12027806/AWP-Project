const { Sequelize } = require("sequelize");
//const setupAssociations = require("./associations");
//setupAssociations();


const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db/database.sqlite", 
});

sequelize.authenticate()
  .then(() => {
    console.log("Connection to SQLite has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
