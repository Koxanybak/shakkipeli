const { makeExecutableSchema } = require("graphql-tools")
const gameResolvers = require("./gameResolvers")
const gameTypeDefs = require("./gameTypeDefs")

const gameSchema = makeExecutableSchema({
  typeDefs: gameTypeDefs,
  resolvers: gameResolvers,
})

module.exports = gameSchema