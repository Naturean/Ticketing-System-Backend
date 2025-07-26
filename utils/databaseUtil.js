import { Sequelize } from "sequelize";
import { getEnvironmentVariable } from "./envUtil.js";

const { database, username, password, host } = getEnvironmentVariable();

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: "mysql",
  // logging: (...msg) => console.log(msg),
});

export default sequelize;
