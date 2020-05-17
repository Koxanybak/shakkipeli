const {
  UserInputError,
  AuthenticationError,
  withFilter,
} = require("apollo-server-express")
const { findGame } = require("../chess/gameHelper")
const Game = require("../chess/game")
const { v4: uuid } = require("uuid")

const gamesInProgress = []

const gameResolvers = {
  // query resolvers
  Query: {
    getGame: (root, args) => {
      const game = findGame(args.gameId, gamesInProgress)

      return game
    },
  },
  
  // mutation resolvers
  Mutation: {
    makeMove: (root, args, { currentUser, pubsub }) => {
      console.log(args)
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
        pubsub.publish("MOVE_MADE", { moveMade: game })
      }

      if (game.gameOver) {
        gamesInProgress.filter(g => g.id === args.move.gameId)
      }

      return game
    },

    promote: (root, args, { currentUser, pubsub }) => {
      const game = findGame(args.gameId, gamesInProgress)

      if (!currentUser
        || (currentUser.id !== game.whitePlayer && currentUser.id !== game.blackPlayer)) {
        throw new AuthenticationError("Invalid token")
      }

      if (game.promote(args.pieceType, currentUser.id)) {
        pubsub.publish("MOVE_MADE", { moveMade: game })
        return game
      }

      throw new UserInputError("Nothing to promote my friend")
    },

    createGame: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("Invalid token")
      }
      const game = new Game(uuid())
      gamesInProgress.push(game)

      return game
    },

    joinGame: async (root, args, { currentUser }) => {
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

      return game
    },
  },

  Subscription: {
    moveMade: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator("MOVE_MADE"),
        (payload, variables) => {
          return payload.moveMade.id === variables.gameId
        }
      )
    }
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
  }
}

module.exports = gameResolvers