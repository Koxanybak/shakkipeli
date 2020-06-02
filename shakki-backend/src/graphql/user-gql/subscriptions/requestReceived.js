const { gql, withFilter, AuthenticationError } = require("apollo-server-express")

const typeDefs = gql`
  extend type Subscription {
    requestReceived(userId: String): FriendRequest!
  }
`

const resolvers = {
  Subscription: {
    requestReceived: {
      subscribe: withFilter(
        (_, { userId }, { pubsub }) => {
          /* console.log("subsicribed received") */
          if (!userId) {
            /* console.log("heitti poikkeuksen") */
            throw new AuthenticationError("No id provided")
          }
          return pubsub.asyncIterator("REQUEST_RECEIVED")
        },
        (payload, { userId }) => {
          /* console.log("payload:", payload)
          console.log("userId:", userId)
          console.log("payload.requestReceived.to:", payload.requestReceived.to)
          console.log("payload.requestReceived.to.id.toString() === userId:",
          payload.requestReceived.to.id.toString() === userId) */
          return payload.requestReceived.to.id.toString() === userId
        }
      )
    }
  },
}

module.exports = {
  typeDefs,
  resolvers,
}