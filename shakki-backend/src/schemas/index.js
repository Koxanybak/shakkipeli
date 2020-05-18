const { makeExecutableSchema, mergeSchemas } = require("graphql-tools")
const userResolvers = require("./userSchema/userResolvers")
const userTypeDefs = require("./userSchema/userTypeDefs")
const gameResolvers = require("./gameSchema/gameResolvers")
const gameTypeDefs = require("./gameSchema/gameTypeDefs")

const userSchema = makeExecutableSchema({
  typeDefs: userTypeDefs,
})

const gameSchema = makeExecutableSchema({
  typeDefs: gameTypeDefs,
})

const typeSchema = mergeSchemas({
  schemas: [userSchema, gameSchema]
})

module.exports = { typeSchema, userResolvers, gameResolvers}