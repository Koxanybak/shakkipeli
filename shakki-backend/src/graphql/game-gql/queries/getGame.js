const { findGame } = require("../../../chess/gameHelper")
const { gql } = require("apollo-server-express")

const typeDefs = gql`
  extend type Query {
    getGame(gameId: String!): Game!
  }
`

const resolvers = {
  Query: {
    getGame: (root, args, { gamesInProgress }) => {
      const game = findGame(args.gameId, gamesInProgress)

      return game
    },
  },
}

module.exports = {
  typeDefs,
  resolvers,
}