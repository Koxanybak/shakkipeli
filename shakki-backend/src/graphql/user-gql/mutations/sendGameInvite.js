const { gql, AuthenticationError, ApolloError, } = require("apollo-server-express")

const typeDefs = gql`
  extend type Mutation {
    sendGameInvite(tag: String): GameInvite!
  }
`

const resolvers = {
  Mutation: {
    sendGameInvite: async (root, { tag }, { pubsub, currentUser, models: { User, } }) => {
      if (!currentUser || currentUser.guest) {
        throw new AuthenticationError("Invalid token")
      }

      const userInDb = await User.findById(currentUser.id)
      const friendInDb = await User.findOne({ tag })

      if ((userInDb && userInDb.tag === tag) || (!userInDb || !friendInDb)) {
        throw new ApolloError("User not found")
      }

      // they are not friends
      if (!userInDb.friends.includes(friendInDb._id) || !friendInDb.friends.includes(userInDb._id)) {
        throw new ApolloError("The user has removed you from their friends list")
      }

      try {
        const invite = {
          from: userInDb.tag,
          to: friendInDb.tag,
          resolveStatus: null,
        }

        pubsub.publish("INVITE_RECEIVED", { inviteReceived: invite })

        return invite
      } catch (e) {
        console.log(e)
        throw new ApolloError("Something went wrong sending the invite:", e.message)
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers,
}