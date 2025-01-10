const sequelize = require("./models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const { PubSub } = require("graphql-subscriptions");
const Message = require("./models/Message");
const Village = require("./models/Village");
const Gallery = require("./models/Gallery");
//const Population = require("./models/Population");
const { Op, Sequelize } = require("sequelize");
const JWT_SECRET = "Zaid_Sayed";
const pubsub = new PubSub();

const resolvers = {
  Query: {
    getAdmins: async (_, { userId }) => {
      try {
        const adminIds = await User.findAll({
          where: { role: "admin" },
          attributes: ["id"],
          raw: true,
        });
        const adminIdList = adminIds.map((admin) => admin.id);

        const senderIds = await Message.findAll({
          where: { receiverId: userId },
          attributes: [
            [sequelize.fn("DISTINCT", sequelize.col("senderId")), "id"],
          ],
          raw: true,
        });

        const receiverIds = await Message.findAll({
          where: { senderId: userId },
          attributes: [
            [sequelize.fn("DISTINCT", sequelize.col("receiverId")), "id"],
          ],
          raw: true,
        });

        const uniqueUserIds = new Set([
          ...adminIdList,
          ...senderIds.map((sender) => sender.id),
          ...receiverIds.map((receiver) => receiver.id),
        ]);

        const users = await User.findAll({
          where: {
            id: Array.from(uniqueUserIds),
          },
          attributes: ["id", "username", "email", "role"],
        });

        return users;
      } catch (error) {
        console.error("Error fetching admins and related users:", error);
        throw new Error("Failed to fetch users.");
      }
    },
    getMessages: async (_, { senderId, receiverId }) =>
      await Message.findAll({
        where: {
          [Op.or]: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        },
        order: [["timestamp", "ASC"]],
      }),

    login: async (_, { username, password }) => {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        throw new Error("User not found");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
      };
    },

    villages: async () => {
      console.log("reachedHere");
      try {
        const data = await Village.findAll();
        return data;
      } catch (error) {
        throw new Error("Failed to fetch villages.");
      }
    },

    gallery: async () => {
      try {
        const data = await Gallery.findAll();
        return data;
      } catch (error) {
        throw new Error("Failed to fetch Gallery.");
      }
    },

    stats: async () => {
      try {
        const totalVillages = await Village.count();

        const totalUrbanArea = await sequelize.query(
          `SELECT COUNT(*) as count
           FROM Villages, json_each(Villages.tags)
           WHERE json_each.value = 'urban';`,
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );

        const averageLandArea = await Village.findOne({
          attributes: [
            [Sequelize.fn("AVG", Sequelize.col("landArea")), "avgLandArea"],
          ],
          raw: true,
        });

        const totalPopulation = await Village.findOne({
          attributes: [
            [
              Sequelize.fn("SUM", Sequelize.col("population")),
              "totalPopulation",
            ],
          ],
          raw: true,
        });

        return {
          totalVillages,
          totalPopulation: totalPopulation?.totalPopulation || 0,
          averageLandArea: averageLandArea?.avgLandArea || 0,
          totalUrbanArea: totalUrbanArea[0]?.count || 0,
        };
      } catch (error) {
        throw new Error("Failed to fetch stats.");
      }
    },
  },
  Mutation: {
    addImage: async (_, { description, URL, villageId }) => {
      try {
        await Gallery.create({
          description,
          URL,
          villageId,
        });
        console.log("new image added successfully");
      } catch (error) {
        throw new Error("Unable to add image. Please try again.");
      }
    },
    addVillage: async (
      _,
      { name, region, population, landArea, latitude, longitude, tags }
    ) => {
      try {
        const newVillage = await Village.create({
          name,
          region,
          population,
          landArea,
          latitude,
          longitude,
          tags,
        });
        return newVillage;
      } catch (error) {
        console.error("Error adding village:", error);
        throw new Error("Failed to add village");
      }
    },
    updateVillage: async (
      _,
      { id, name, region, population, landArea, latitude, longitude }
    ) => {
      try {
        const village = await Village.findByPk(id);
        if (!village) {
          throw new Error("Village not found");
        }

        await village.update({
          name: name || village.name,
          region: region || village.region,
          population: population || village.population,
          landArea: landArea || village.landArea,
          latitude: latitude || village.latitude,
          longitude: longitude || village.longitude,
        });

        return village;
      } catch (error) {
        console.error("Error updating village:", error);
        throw new Error("Failed to update village");
      }
    },
    addUpdateVillageDemoData: async (
      _,
      { id, ageDist, genderRatio, populationGrowthRate }
    ) => {
      try {
        const village = await Village.findByPk(id);
        if (!village) {
          throw new Error("Village not found");
        }

        await village.update({
          ageDist: ageDist || village.ageDist,
          genderRatio: genderRatio || village.genderRatio,
          populationGrowthRate:
            populationGrowthRate || village.populationGrowthRate,
        });

        return village;
      } catch (error) {
        console.error("Error adding/updating demographic data:", error);
        throw new Error("Failed to add/update demographic data");
      }
    },

    deleteVillage: async (_, { id }) => {
      try {
        const village = await Village.findByPk(id);
        if (!village) {
          throw new Error("Village not found");
        }

        await village.destroy();
        return `Village with ID ${id} deleted successfully.`;
      } catch (error) {
        console.error("Error deleting village:", error);
        throw new Error("Failed to delete village");
      }
    },
    sendMessage: async (_, { senderId, receiverId, message }) => {
      const newMessage = await Message.create({
        senderId,
        receiverId,
        message,
      });
      console.log(pubsub);
      console.log(typeof pubsub.asyncIterator);
      pubsub.publish("NEW_MESSAGE", { messageReceived: newMessage });
      return newMessage;
    },
    createUser: async (_, { username, password, email }) => {
      try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
          throw new Error("Username is already taken.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
          username,
          password: hashedPassword,
          email,
        });

        const token = jwt.sign(
          { id: newUser.id, username: newUser.username },
          "Zaid_Sayed",
          { expiresIn: "1h" }
        );

        return {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          token,
        };
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user. Please try again.");
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: () => {
        console.log(pubsub);
        console.log(typeof pubsub.asyncIterator);
        pubsub.asyncIterator(["NEW_MESSAGE"]);
      },
    },
  },
};

module.exports = resolvers;
