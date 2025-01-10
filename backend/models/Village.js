const { DataTypes } = require("sequelize");
const sequelize = require("./index");
//const Population = require("./Population");
//const Gallery = require("./Gallery");

const Village = sequelize.define("Village", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    region: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    landArea: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    tags: {
        type: DataTypes.JSON, // Store tags as a JSON array
        allowNull: false,
    },
    population: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ageDist: {
        type: DataTypes.JSON,
        allowNull: true
    },
    genderRatio: {
        type: DataTypes.JSON,
        allowNull: true
    },
    populationGrowthRate: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },

});
/*
Village.hasMany(Population, { foreignKey: "villageId", as: "population" });
Village.hasMany(Gallery, { foreignKey: "villageId", as: "gallery" });*/
module.exports = Village;