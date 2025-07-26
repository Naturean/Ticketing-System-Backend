import { Sequelize } from "sequelize";
import { database, username, password, host } from "./envUtil.js";

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: "mysql",
  // logging: (...msg) => console.log(msg),
});

export default sequelize;
