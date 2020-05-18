const { gql } = require("apollo-server-express")
const { makeExecutableSchema } = require("graphql-tools")
const { merge } = require("lodash")
const User = require("./user-gql/types/User")
const Game = require("./game-gql/types/Game")
const getLoggerUserQuery = require("./user-gql/queries/getLoggedUser")
const addUserMutation = require("./user-gql/mutations/addUser")
const loginMutation = require("./user-gql/mutations/login")
const getGameQuery = require("./game-gql/queries/getGame")
const createGameMutation = require("./game-gql/mutations/createGame")
const joinGameMutation = require("./game-gql/mutations/joinGame")
const makeMoveMutation = require("./game-gql/mutations/makeMove")
const promoteMutation = require("./game-gql/mutations/promote")
const moveMadeSubscription = require("./game-gql/subscriptions/moveMade")

const rootTypeDefs = gql`
  type Query {
    root: String
  }

  type Mutation {
    root: String
  }

  type Subscription {
    root: String
  }
`

const typeDefs = [
  rootTypeDefs,
  Game.typeDefs,
  User.typeDefs,

  getLoggerUserQuery.typeDefs,
  addUserMutation.typeDefs,
  loginMutation.typeDefs,

  getGameQuery.typeDefs,
  createGameMutation.typeDefs,
  joinGameMutation.typeDefs,
  makeMoveMutation.typeDefs,
  promoteMutation.typeDefs,
  moveMadeSubscription.typeDefs,
]

const resolvers = merge(
  getLoggerUserQuery.resolvers,
  addUserMutation.resolvers,
  loginMutation.resolvers,
  
  getGameQuery.resolvers,
  createGameMutation.resolvers,
  joinGameMutation.resolvers,
  makeMoveMutation.resolvers,
  promoteMutation.resolvers,
  moveMadeSubscription.resolvers,
)

const createSchema = () => {
  return makeExecutableSchema({
    typeDefs,
    resolvers,
  })
}

module.exports = createSchema