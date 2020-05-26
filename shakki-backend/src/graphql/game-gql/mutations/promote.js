const { gql, AuthenticationError, UserInputError, ApolloError } = require("apollo-server-express")
const { findGame } = require("../../../chess/gameHelper")
const ObjectId = require("mongoose").Types.ObjectId

const isObjectId = string => {
  /* console.log("isObjectId for", string) */
  const id = new ObjectId(string)
  /* console.log("id:", id)
  console.log("id.toString()", id.toString())
  console.log("id.toHexString()", id.toHexString()) */
  return string === id.toString()
}

const typeDefs = gql`
  extend type Mutation {
    promote(gameId: String!, pieceType: String!): Game!
  }
`

const resolvers = {
  Mutation: {
    promote: async (root, args, { currentUser, pubsub, gamesInProgress, models: { Match, User, } }) => {
      const game = findGame(args.gameId, gamesInProgress)

      if (!currentUser
        || (currentUser.id !== game.whitePlayer && currentUser.id !== game.blackPlayer)) {
        throw new AuthenticationError("Invalid token")
      }

      if (game.promote(args.pieceType, currentUser.id)) {
        pubsub.publish("GAME_STATE_UPDATED", { gameStateUpdated: game })

        if (game.gameOver) {
          gamesInProgress.filter(g => g.id === args.move.gameId)

          // adds the match to the database
          /* try { */

          // checks if the players are users (not guests)
          let whitePlayerIsUser = false
          try {
            whitePlayerIsUser = isObjectId(game.whitePlayer)
          } catch (e) {
            whitePlayerIsUser = false
          }
          let blackPlayerIsUser = false
          try {
            blackPlayerIsUser = isObjectId(game.blackPlayer)
          } catch (e) {
            blackPlayerIsUser = false
          }
          let winnerIsUser = false
          try {
            winnerIsUser = isObjectId(game.winner)
          } catch (e) {
            winnerIsUser = false
          }
          console.log(whitePlayerIsUser, blackPlayerIsUser)

          // match is not added if both users are guests
          if (whitePlayerIsUser || blackPlayerIsUser) {
            const newMatchEntry = new Match({
              board: game.getBoard(),
              whitePlayer: whitePlayerIsUser ? game.whitePlayer : null,
              blackPlayer: blackPlayerIsUser ? game.blackPlayer : null,
              winner: winnerIsUser ? game.winner : null,
              moveHistory: game.moveHistory,
            })

            try {
              let savedMatch = await newMatchEntry.save()

              // adds the match to the players match history
              if (whitePlayerIsUser) {
                const whitePlayer = await User.findById(game.whitePlayer)
                if (!whitePlayer.matches) {
                  whitePlayer.matches = []
                }
                whitePlayer.matches = whitePlayer.matches.concat(savedMatch._id)
                let updated = await User.findByIdAndUpdate(whitePlayer._id, whitePlayer, { new: true})
                console.log("white updated:",updated)
              }
              if (blackPlayerIsUser) {
                const blackPlayer = await User.findById(game.whitePlayer)
                if (!blackPlayer.matches) {
                  blackPlayer.matches = []
                }
                blackPlayer.matches = blackPlayer.matches.concat(savedMatch._id)
                let updated = await User.findByIdAndUpdate(blackPlayer._id, blackPlayer, { new: true})
                console.log("black updated:",updated)
              }
            } catch (e) {
              console.log(e)
              throw new ApolloError("Something went wrong saving the match.")
            }
          }
          /* } catch (e) {
            console.log(e)
          } */
        }

        return game
      }

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