/*

THIS IS NOT USED>>> FAILED ATTEMPT

*/

const Village = require("./Village");
const Population = require("./Population");
const Gallery = require("./Gallery");

const setupAssociations = () => {

    Village.hasMany(Gallery, { foreignKey: "villageId", as: "gallery" });
    Village.hasMany(Population, { foreignKey: "villageId", as: "population" });
    Population.belongsTo(Village, { foreignKey: "villageId" });
    Gallery.belongsTo(Village, { foreignKey: "villageId" });

};
module.exports = setupAssociations;