const { gql, AuthenticationError } = require("apollo-server-express")
const Game = require("../../../chess/game")
const { v4: uuid } = require("uuid")

const typeDefs = gql`
  extend type Mutation {
    createGame: Game!
  }
`

const resolvers = {
  Mutation: {
    createGame: async (root, args, { currentUser, gamesInProgress }) => {
      if (!currentUser) {
        throw new AuthenticationError("Invalid token")
      }
      const game = new Game(uuid())

      gamesInProgress.push(game)

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