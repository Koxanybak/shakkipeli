const { gql, withFilter, AuthenticationError } = require("apollo-server-express")

const typeDefs = gql`
  extend type Subscription {
    inviteReceived(tag: String): GameInvite!
  }
`

const resolvers = {
  Subscription: {
    inviteReceived: {
      subscribe: withFilter(
        (_, { tag }, { pubsub }) => {
          /* console.log("subsicribed received") */
          if (!tag) {
            /* console.log("heitti poikkeuksen") */
            throw new AuthenticationError("No tag provided")
          }
          return pubsub.asyncIterator("INVITE_RECEIVED")
        },
        (payload, { tag }) => {
          /* console.log(payload)
          console.log(tag) */
          return payload.inviteReceived.to === tag
        }
      )
    }
  },
}

module.exports = {
  typeDefs,
  resolvers,
}