const { gql, withFilter, AuthenticationError } = require("apollo-server-express")

const typeDefs = gql`
  extend type Subscription {
    requestAccepted(userId: String): String!
  }
`

const resolvers = {
  Subscription: {
    requestAccepted: {
      subscribe: withFilter(
        (_, { userId }, { pubsub }) => {
          if (!userId) {
            throw new AuthenticationError("No id provided")
          }
          return pubsub.asyncIterator("REQUEST_ACCEPTED")
        },
        (payload, variables) => {
          /* console.log("payload:", payload)
          console.log("variables.requestId:", variables.requestId) */
          return payload.from.toString() === variables.userId
        }
      )
    }
  },
}

module.exports = {
  typeDefs,
  resolvers,
}