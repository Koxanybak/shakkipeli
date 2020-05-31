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
const gameStateUpdatedSubscription = require("./game-gql/subscriptions/gameStateUpdated")
const skipTurnMutation = require("./game-gql/mutations/skipTurn")

const FriendRequest = require("./user-gql/types/FriendRequest")
const requestAcceptedSubscription = require("./user-gql/subscriptions/requestAccepted")
const requestReceivedSubscription = require("./user-gql/subscriptions/requestReceived")
const sendFriendRequestMutation = require("./user-gql/mutations/sendFriendRequest")
const acceptFriendRequestMutation = require("./user-gql/mutations/acceptFriendRequest")
const removeFriendMutation = require("./user-gql/mutations/removeFriend")

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
  FriendRequest.typeDefs,

  getLoggerUserQuery.typeDefs,
  addUserMutation.typeDefs,
  loginMutation.typeDefs,

  requestAcceptedSubscription.typeDefs,
  requestReceivedSubscription.typeDefs,
  sendFriendRequestMutation.typeDefs,
  acceptFriendRequestMutation.typeDefs,
  removeFriendMutation.typeDefs,

  getGameQuery.typeDefs,
  createGameMutation.typeDefs,
  joinGameMutation.typeDefs,
  makeMoveMutation.typeDefs,
  promoteMutation.typeDefs,
  gameStateUpdatedSubscription.typeDefs,
  skipTurnMutation.typeDefs,
]

const resolvers = merge(
  getLoggerUserQuery.resolvers,
  addUserMutation.resolvers,
  loginMutation.resolvers,

  requestAcceptedSubscription.resolvers,
  requestReceivedSubscription.resolvers,
  sendFriendRequestMutation.resolvers,
  acceptFriendRequestMutation.resolvers,
  removeFriendMutation.resolvers,
  
  getGameQuery.resolvers,
  createGameMutation.resolvers,
  joinGameMutation.resolvers,
  makeMoveMutation.resolvers,
  promoteMutation.resolvers,
  gameStateUpdatedSubscription.resolvers,
  skipTurnMutation.resolvers,
  Game.resolvers,
)

const createSchema = () => {
  return makeExecutableSchema({
    typeDefs,
    resolvers,
  })
}

module.exports = createSchema