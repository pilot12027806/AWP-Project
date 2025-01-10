const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const typeDefs = require("./schema"); 
const resolvers = require("./resolvers"); 

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema, 
  resolvers, 
});

const app = express();
const httpServer = http.createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql", 
});

useServer({ schema }, wsServer);

server.start().then(() => {
  app.use(
    "/graphql",
    cors({ origin: "http://localhost:3000", credentials: true }), // Enable CORS
    bodyParser.json(),
    expressMiddleware(server) 
  );

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}/graphql`);
  });
});




