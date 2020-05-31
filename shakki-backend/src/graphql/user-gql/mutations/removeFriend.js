const { gql, AuthenticationError, ApolloError, } = require("apollo-server-express")

const typeDefs = gql`
  extend type Mutation {
    removeFriend(tag: String): Boolean!
  }
`

const resolvers = {
  Mutation: {
    removeFriend: async (root, { tag }, { currentUser, models: { User, } }) => {
      if (!currentUser || currentUser.guest) {
        throw new AuthenticationError("Invalid token")
      }

      let userInDb = await User.findById(currentUser.id)
      let friendInDb = await User.findOne({ tag })
      if (!userInDb || !friendInDb) {
        throw new ApolloError("User not found")
      }

      // they are not friends
      /* if ((userInDb.friends && !userInDb.friends.includes(friendInDb._id)) ||
      (friendInDb.friends && !friendInDb.friends.includes(userInDb._id))) {
        throw new ApolloError("The users not friends.")
      } */

      try {
        userInDb.friends = userInDb.friends.filter(friendId => friendId.toString() !== friendInDb._id.toString())
        friendInDb.friends = friendInDb.friends.filter(friendId => friendId.toString() !== userInDb._id.toString())

        await User.findByIdAndUpdate(userInDb._id, userInDb)
        await User.findByIdAndUpdate(friendInDb._id, friendInDb)

        /* return User.findById(userInDb._id)
          .populate("friends")
          .populate("sentRequests")
          .populate("receivedRequests") */
        return true
      } catch (e) {
        console.log(e)
        throw new ApolloError("Something went wrong removing the friend:", e.message)
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers,
}