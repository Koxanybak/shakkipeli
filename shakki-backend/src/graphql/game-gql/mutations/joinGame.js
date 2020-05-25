const { gql, AuthenticationError, UserInputError } = require("apollo-server-express")
const { findGame } = require("../../../chess/gameHelper")

const typeDefs = gql`
  extend type Mutation {
    joinGame(gameId: String!): Game!
  }
`

const resolvers = {
  Mutation: {
    joinGame: async (root, args, { currentUser, gamesInProgress, pubsub }) => {
      if (!currentUser) {
        throw new AuthenticationError("Invalid token")
      }
      const game = findGame(args.gameId, gamesInProgress)
      if (game.whitePlayer === currentUser.id || game.blackPlayer === currentUser.id) {
        throw new UserInputError("You are already in the game")
      }
      if (game.isFull()) {
        throw new UserInputError("The game is already full :(")
      }
      game.addPlayer(currentUser.id)

      pubsub.publish("GAME_STATE_UPDATED", { gameStateUpdated: game })

      return game
    },
  },
  Game: {
    board: (root) => {
      return root.getBoard()
    },
    lastMove: (root) => {
      return root.lastMove
    },
    check: (root) => {
      return root.check
    }
  },
}

module.exports = {
  typeDefs,
  resolvers,
}