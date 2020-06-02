const { gql, withFilter, AuthenticationError } = require("apollo-server-express")

const typeDefs = gql`
  extend type Subscription {
    requestAccepted(userId: String): FriendRequest!
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
          /* console.log("payload.requestAccepted.from", payload.requestAccepted.from) */
          return payload.requestAccepted.from.id.toString() === variables.userId
        }
      )
    }
  },
}

module.exports = {
  typeDefs,
  resolvers,
}