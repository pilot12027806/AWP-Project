



/*
THIS WAS SCRAPED
*/



const { DataTypes } = require("sequelize");
const sequelize = require("./index");
//const Village = require("./Village");

const Population = sequelize.define("Population", {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: { //not needed
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: { //should be DOB but for simplicity we will use age
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM("male", "female"),
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

//Population.belongsTo(Village, { foreignKey: "villageId" });

module.exports = Population;