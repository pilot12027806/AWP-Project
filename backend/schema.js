const { buildSchema } = require("graphql");

//    population: [Population]
/*  type Population {
  id: Int
  name: String
  age: Int
  gender: Gender
  villageId: Int
}*/
const schema = buildSchema(`
  enum Gender {
  male
  female
  }

type User {
    id: Int!
    username: String!
    email: String!
    role: String!
    token: String
  }
     input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  type Message {
    id: Int
    senderId: Int
    receiverId: Int
    message: String
    timestamp: String
    isRead: Boolean
  }

  type AgeDist {
    ageGroup: String
    percentage: Int
    }
    type GenderRatio {
    gender : String
    ratio : Int
    }

    input AgeDistInput {
  ageGroup: String
  percentage: Int
}

input GenderRatioInput {
  gender: String
  ratio: Int
}

  type Village {
    id: Int
    name: String
    region: String
    landArea: Float
    latitude: Float
    longitude: Float
    tags: [String]
    population : Int
    ageDist: [AgeDist]
    genderRatio: [GenderRatio]
    populationGrowthRate: Float
  }
    


  type Query {
    villages: [Village]
    villagesById(id: Int!): [Village]
    villagesByTag(tag: String!): [Village]
    stats: Stats
    gallery: [Image]
    login(username: String!, password: String!): User
    getAdmins(userId: Int!): [User]
    getMessages(senderId: Int!, receiverId: Int!): [Message]
  }

type Stats {
  totalVillages: Int
  totalPopulation: Int
  averagePopulation: Float
  averageLandArea: Float
  totalUrbanArea: Int
}

  type Image {
  id: Int
  description: String
  URL: String
  villageId: Int
}


  
  type Mutation {

  addImage(
   description: String!
  URL: String!
  villageId: Int!
  ): Image

    addVillage(
      name: String!,
      region: String!,
      population: Int!,
      landArea: Float!,
      latitude: Float!,
      longitude: Float!,
      tags: [String]!
    ): Village

    updateVillage(
      id: Int!,
      name: String,
      region: String,
      population: Int,
      landArea: Float,
      latitude: Float,
      longitude: Float,
    ): Village

    addUpdateVillageDemoData(
    id:Int!,
    ageDist: [AgeDistInput],
    genderRatio :[GenderRatioInput],
    populationGrowthRate : Float
    ): Village

    deleteVillage(id: Int!): String

  createUser(username: String!, password: String!, email: String!): User

    sendMessage(senderId: Int!, receiverId: Int!, message: String!): Message

  }

type Subscription {
    newMessage: Message
  }

`);

module.exports = schema;
