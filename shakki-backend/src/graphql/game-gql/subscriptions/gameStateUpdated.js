const { gql, withFilter } = require("apollo-server-express")

const typeDefs = gql`
  extend type Subscription {
    gameStateUpdated(gameId: String!): Game!
  }
`

const resolvers = {
  Subscription: {
    gameStateUpdated: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator("GAME_STATE_UPDATED"),
        (payload, variables) => {
          return payload.gameStateUpdated.id === variables.gameId
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
  },
}

module.exports = {
  typeDefs,
  resolvers,
}