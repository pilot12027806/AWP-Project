const sequelize = require("./models/index");
const Village = require("./models/Village");
const Population = require("./models/Population");
const Gallery = require("./models/Gallery");
const User = require("./models/User");
const Message = require('./models/Message');

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // `force: true` drops the table if it already exists
    console.log("Database synced successfully!");

    await Village.bulkCreate([
      {
        name: "Askar Camp",
        region: "West Bank",
        landArea: 6,
        latitude: 32.21491,
        longitude: 35.30347,
        tags: ["rural", "urban"],
        population: 5000,
        ageDist: [
          { ageGroup: "0-14", percentage: 30 },
          { ageGroup: "15-64", percentage: 60 },
          { ageGroup: "65+", percentage: 10 },
        ],
        genderRatio: [
          { gender: "Male", ratio: 51 },
          { gender: "Female", ratio: 49 },
        ],
        populationGrowthRate: 1.5,
      },
      {
        name: "Beit Lahiya",
        region: "Gaza Strip",
        population: 40000,
        landArea: 18,
        latitude: 31.9822,
        longitude: 35.2834,
        tags: ["rural"],
        population: 9000,
        ageDist: [
          { ageGroup: "0-14", percentage: 35 },
          { ageGroup: "15-64", percentage: 40 },
          { ageGroup: "65+", percentage: 52 },
        ],
        genderRatio: [
          { gender: "Male", ratio: 60 },
          { gender: "Female", ratio: 40 },
        ],
        populationGrowthRate: 0.85,
      },
      {
        name: "Fara'ah",
        region: "West Bank",
        landArea: 5,
        latitude: 32.2914,
        longitude: 35.3379,
        tags: ["rural"],
        population: 2000,
        ageDist: [
          { ageGroup: "0-14", percentage: 50 },
          { ageGroup: "15-64", percentage: 45 },
          { ageGroup: "65+", percentage: 5 },
        ],
        genderRatio: [
          { gender: "Male", ratio: 40 },
          { gender: "Female", ratio: 60 },
        ],
        populationGrowthRate: 0.5,
      },
      {
        name: "Qabalan",
        region: "West Bank",
        landArea: 12,
        latitude: 32.1022,
        longitude: 35.2879,
        tags: ["rural"],
        population: 10000,
        ageDist: [
          { ageGroup: "0-14", percentage: 40 },
          { ageGroup: "15-64", percentage: 30 },
          { ageGroup: "65+", percentage: 30 },
        ],
        genderRatio: [
          { gender: "Male", ratio: 70 },
          { gender: "Female", ratio: 30 },
        ],
        populationGrowthRate: 0.2,
      },
      {
        name: "Surda",
        region: "West Bank",
        population: 1000,
        landArea: 6,
        latitude: 31.9427,
        longitude: 35.203,
        tags: ["urban"],
        population: 1000,
        ageDist: [
          { ageGroup: "0-14", percentage: 20 },
          { ageGroup: "15-64", percentage: 50 },
          { ageGroup: "65+", percentage: 30 },
        ],
        genderRatio: [
          { gender: "Male", ratio: 55 },
          { gender: "Female", ratio: 45 },
        ],
        populationGrowthRate: 1.5,
      },
      {
        name: "New Village",
        region: "Gaza Strip",
        population: 1500,
        landArea: 7,
        latitude: 31.9622,
        longitude: 35.2034,
        tags: ["urban"],
        population: 3000,
        ageDist: [
          { ageGroup: "0-14", percentage: 30 },
          { ageGroup: "15-64", percentage: 60 },
          { ageGroup: "65+", percentage: 10 },
        ],
        genderRatio: [
          { gender: "Male", ratio: 51 },
          { gender: "Female", ratio: 49 },
        ],
        populationGrowthRate: 1.5,
      },
    ]);

    await Gallery.bulkCreate([
      {
        description: "Askar Camp - A rural and urban blend",
        URL: "https://via.placeholder.com/300x200?text=Askar+Camp",
        villageId: 1,
      },
      {
        description: "Askar Camp - Vibrant community life",
        URL: "https://via.placeholder.com/300x200?text=Community+Life",
        villageId: 1,
      },
      {
        description: "Beit Lahiya - Rural beauty",
        URL: "https://via.placeholder.com/300x200?text=Beit+Lahiya",
        villageId: 2,
      },
      {
        description: "Beit Lahiya - Scenic landscapes",
        URL: "https://via.placeholder.com/300x200?text=Scenic+Landscapes",
        villageId: 2,
      },
      {
        description: "Fara'ah - Peaceful village life",
        URL: "https://via.placeholder.com/300x200?text=Fara'ah",
        villageId: 3,
      },
      {
        description: "Fara'ah - Rural tranquility",
        URL: "https://via.placeholder.com/300x200?text=Tranquility",
        villageId: 3,
      },
      {
        description: "Qabalan - A historic village",
        URL: "https://via.placeholder.com/300x200?text=Qabalan",
        villageId: 4,
      },
      {
        description: "Qabalan - Serene views",
        URL: "https://via.placeholder.com/300x200?text=Serene+Views",
        villageId: 4,
      },
      {
        description: "Surda - Urban charm",
        URL: "https://via.placeholder.com/300x200?text=Surda",
        villageId: 5,
      },
      {
        description: "Surda - Bustling streets",
        URL: "https://via.placeholder.com/300x200?text=Bustling+Streets",
        villageId: 5,
      },
      {
        description: "New Village - Emerging urban area",
        URL: "https://via.placeholder.com/300x200?text=New+Village",
        villageId: 6,
      },
      {
        description: "New Village - Modern vibes",
        URL: "https://via.placeholder.com/300x200?text=Modern+Vibes",
        villageId: 6,
      },
    ]);

    await User.bulkCreate([
        {
            username: "admin1",
            email: "admin1@example.com",
            password: "$2b$10$tNTvAfCReKIBRCvzkVy8weO.VP1bZFesgI67wRAuuhoIb5q3Ykm3G", // password123
            role: "admin",
        },
        {
            username: "admin2",
            email: "admin2@example.com",
            password: "$2b$10$tNTvAfCReKIBRCvzkVy8weO.VP1bZFesgI67wRAuuhoIb5q3Ykm3G", /// password123
            role: "admin",
        },
        {
            username: "admin3",
            email: "admin3@example.com",
            password: "$2b$10$tNTvAfCReKIBRCvzkVy8weO.VP1bZFesgI67wRAuuhoIb5q3Ykm3G", // password123
        },
        {
            username: "user1",
            email: "user1@example.com",
            password: "$2b$10$tNTvAfCReKIBRCvzkVy8weO.VP1bZFesgI67wRAuuhoIb5q3Ykm3G", // password123
            role: "user",
        }
    ]);
    await Message.bulkCreate([
        {
          senderId: 1,
          receiverId: 2,
          message:"added by db"// password123
        },
        
    ]);
    console.log("Sample data inserted successfully!");
  } catch (err) {
    console.error("Error syncing the database:", err);
  } finally {
    process.exit();
  }
};

syncDatabase();
