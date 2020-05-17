const { makeExecutableSchema } = require("graphql-tools")
const userResolvers = require("./userResolvers")
const userTypeDefs = require("./userTypeDefs")

const userSchema = makeExecutableSchema({
  typeDefs: userTypeDefs,
  resolvers: userResolvers,
})

module.exports = userSchema