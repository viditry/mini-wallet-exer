const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const config = require(__dirname + "/../../config/database");
const db = {};

const dev = config.development;
const prod = config.production;

let sequelize;
if (process.env.NODE_ENV === "development") {
  sequelize = new Sequelize(dev.database, dev.username, dev.password, {
    host: dev.host,
    dialect: dev.dialect,
  });
} else {
  sequelize = new Sequelize(prod.database, prod.username, prod.password, {
    host: prod.host,
    dialect: prod.dialect,
  });
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
