const { DataTypes } = require("sequelize");
const sequelize = require("./index");
//const Village = require("./Village");


/*
THIS SHOUDLN'T BE USED>>>> ADD IMAGE BUTTON MAKES THIS HAPPEN




*/
const Gallery = sequelize.define("Gallery", {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    URL: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    villageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Villages",
            key: "id",
        },
    },

});

//Gallery.belongsTo(Village, { foreignKey: "villageId" });

module.exports = Gallery;