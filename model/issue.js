import { DataTypes } from "sequelize";
import sequelize from "../utils/databaseUtil.js";

const Issue = sequelize.define(
  "Issue",
  {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: true,
    //   allowNull: false,
    // },
    poster: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "create_date",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.ENUM,
      values: ["wait", "fixing", "complete"],
      allowNull: false,
    },
    fixedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "fixed_date",
    },
    staffId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "staff_id",
    },
  },
  {
    tableName: "issue",
    createdAt: false,
    updatedAt: false,
  }
);

export default Issue;
