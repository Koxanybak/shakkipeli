const { gql, AuthenticationError } = require("apollo-server-express")
const { findGame } = require("../../../chess/gameHelper")

const typeDefs = gql`
  extend type Mutation {
    makeMove(move: MoveInput!): Game!
  }
`

const resolvers = {
  Mutation: {
    makeMove: (root, args, { currentUser, pubsub, gamesInProgress }) => {
      const game = findGame(args.move.gameId, gamesInProgress)

      if (!currentUser
        || (currentUser.id !== game.whitePlayer && currentUser.id !== game.blackPlayer)) {
        throw new AuthenticationError("Invalid token")
      }
      /* try { */
      game.makeMove(
        args.move.piece,
        args.move.oldLocation,
        args.move.newLocation,
        currentUser.id,
      )
      /* } catch (e) {
        console.log(e.stack)
      } */

      if (game.lastMove.success) {
        pubsub.publish("GAME_STATE_UPDATED", { gameStateUpdated: game })
      }

      if (game.gameOver) {
        gamesInProgress.filter(g => g.id === args.move.gameId)
      }

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