const { gql, AuthenticationError, UserInputError } = require("apollo-server-express")
const { findGame } = require("../../../chess/gameHelper")

const typeDefs = gql`
  extend type Mutation {
    promote(gameId: String!, pieceType: String!): Game!
  }
`

const resolvers = {
  Mutation: {
    promote: (root, args, { currentUser, pubsub, gamesInProgress }) => {
      const game = findGame(args.gameId, gamesInProgress)

      if (!currentUser
        || (currentUser.id !== game.whitePlayer && currentUser.id !== game.blackPlayer)) {
        throw new AuthenticationError("Invalid token")
      }

      /* try { */
      if (game.promote(args.pieceType, currentUser.id)) {
        pubsub.publish("GAME_STATE_UPDATED", { gameStateUpdated: game })
        return game
      }
      /* } catch (e) {
        console.log(e)
      } */

      throw new UserInputError("Nothing to promote my friend")
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