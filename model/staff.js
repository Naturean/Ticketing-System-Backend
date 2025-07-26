import { DataTypes } from "sequelize";
import sequelize from "../utils/databaseUtil.js";

const Staff = sequelize.define(
  "Staff",
  {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: true,
    //   allowNull: false,
    // },
    staffName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "staff_name",
    },
    staffRole: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "staff_role",
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "account_name",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "avatar_url",
    },
  },
  {
    tableName: "staff",
    createdAt: false,
    updatedAt: false,
  }
);

export default Staff;
