const { gql, withFilter, AuthenticationError } = require("apollo-server-express")

const typeDefs = gql`
  extend type Subscription {
    inviteResolved(tag: String): GameInvite!
  }
`

const resolvers = {
  Subscription: {
    inviteResolved: {
      subscribe: withFilter(
        (_, { tag }, { pubsub }) => {
          /* console.log("subsicribed received") */
          if (!tag) {
            /* console.log("heitti poikkeuksen") */
            throw new AuthenticationError("No tag provided")
          }
          return pubsub.asyncIterator("INVITE_RESOLVED")
        },
        (payload, { tag }) => {
          return payload.inviteResolved.from === tag
        }
      )
    }
  },
}

module.exports = {
  typeDefs,
  resolvers,
}