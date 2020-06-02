const { gql, AuthenticationError, ApolloError, } = require("apollo-server-express")
const Game = require("../../../chess/game")
const { v4: uuid } = require("uuid")

const typeDefs = gql`
  extend type Mutation {
    resolveGameInvite(from: String, accepted: Boolean): GameInvite!
  }
`

const resolvers = {
  Mutation: {
    resolveGameInvite: async (root, { from, accepted }, { pubsub, currentUser, models: { User, }, gamesInProgress }) => {
      if (!currentUser || currentUser.guest) {
        throw new AuthenticationError("Invalid token")
      }

      const userInDb = await User.findById(currentUser.id)
      const friendInDb = await User.findOne({ tag: from })

      if ((!userInDb || !friendInDb)) {
        throw new ApolloError("User not found")
      }

      // they are not friends
      if (!userInDb.friends.includes(friendInDb._id) || !friendInDb.friends.includes(userInDb._id)) {
        throw new ApolloError("The user has removed you from their friends list")
      }

      try {

        if (accepted) {
          const game = new Game(uuid(), friendInDb._id.toString(), userInDb._id.toString())

          gamesInProgress.push(game)

          const invite = {
            from: userInDb.tag,
            to: friendInDb.tag,
            resolveStatus: "accepted",
            game,
          }

          pubsub.publish("INVITE_RESOLVED", { inviteResolved: invite })

          return invite
        } else {
          const invite = {
            from: userInDb.tag,
            to: friendInDb.tag,
            resolveStatus: "declined",
            game: null,
          }

          pubsub.publish("INVITE_RESOLVED", { inviteResolved: invite })

          return invite
        }
      } catch (e) {
        console.log(e)
        throw new ApolloError("Something went wrong resolving the invite:", e.message)
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers,
}