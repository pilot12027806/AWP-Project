const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./index");

const Message = sequelize.define("Message", {
  senderId: { type: DataTypes.INTEGER, allowNull: false },
  receiverId: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  timestamp: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = Message;
