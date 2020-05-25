const { gql, AuthenticationError, ApolloError } = require("apollo-server-express")
const { findGame } = require("../../../chess/gameHelper")

const typeDefs = gql`
  extend type Mutation {
    skipTurn(gameId: String!): Game!
  }
`

const resolvers = {
  Mutation: {
    skipTurn: (root, args, { currentUser, pubsub, gamesInProgress }) => {
      const game = findGame(args.gameId, gamesInProgress)

      if (!currentUser
        || (currentUser.id !== game.currentPlayer)) {
        throw new AuthenticationError("Invalid token")
      }
      if (game.check) {
        throw new ApolloError("Cannot switch turn while in check.")
      }

      game.switchTurn()
      pubsub.publish("GAME_STATE_UPDATED", { gameStateUpdated: game })
      return game
    },
  },
}

module.exports = {
  typeDefs,
  resolvers,
}