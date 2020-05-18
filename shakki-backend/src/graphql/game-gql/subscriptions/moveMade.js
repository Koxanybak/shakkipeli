const { gql, withFilter } = require("apollo-server-express")

const typeDefs = gql`
  extend type Subscription {
    moveMade(gameId: String!): Game!
  }
`

const resolvers = {
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
  },
}

module.exports = {
  typeDefs,
  resolvers,
}