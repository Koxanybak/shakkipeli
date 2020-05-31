const { gql, AuthenticationError, ApolloError, } = require("apollo-server-express")

const typeDefs = gql`
  extend type Mutation {
    acceptFriendRequest(requestId: String): Boolean!
  }
`

const resolvers = {
  Mutation: {
    acceptFriendRequest: async (_, { requestId }, { pubsub, currentUser, models: { User, FriendRequest, } }) => {
      if (!currentUser || currentUser.guest) {
        throw new AuthenticationError("Invalid token")
      }

      let requestInDb = await FriendRequest.findById(requestId)
      if (!requestInDb) {
        throw new ApolloError("Request not found")
      }

      let userInDb = await User.findById(currentUser.id)
      let friendInDb = await User.findById(requestInDb.from)

      // user or friends are not in db
      if (!userInDb || !friendInDb) {
        throw new ApolloError("The user has been deleted from the database.")
      }

      // they are friends already
      if ((userInDb.friends && userInDb.friends.includes(friendInDb._id)) ||
      (friendInDb.friends && friendInDb.friends.includes(userInDb._id))) {
        throw new ApolloError("The users are already friends.")
      }

      // request is corrupted
      if (requestInDb.from.toString() !== friendInDb._id.toString() ||
      requestInDb.to.toString() !== userInDb._id.toString()) {
        throw new ApolloError("Users don't match the request.")
      }

      try {
        // updates current user accordingly
        if (!userInDb.friends) {
          userInDb.friends = []
        }
        userInDb.friends = userInDb.friends.concat(friendInDb._id)
        userInDb.receivedRequests = userInDb.receivedRequests.filter(reqId => {
          return reqId.toString() !== requestInDb._id.toString()
        })
        await User.findByIdAndUpdate(userInDb._id, userInDb)

        // updates the new friend accordingly
        if (!friendInDb.friends) {
          friendInDb.friends = []
        }
        friendInDb.friends = friendInDb.friends.concat(userInDb._id)
        friendInDb.sentRequests = friendInDb.sentRequests.filter(reqId => reqId.toString() !== requestInDb._id.toString())
        await User.findByIdAndUpdate(friendInDb._id, friendInDb)

        // deletes the friend request and publishes
        pubsub.publish("REQUEST_ACCEPTED", { requestAccepted: requestInDb })
        await FriendRequest.findByIdAndDelete(requestId)

        /* userInDb = await User.findById(userInDb._id)
          .populate("friends")
          .populate("sentRequests")
          .populate("receivedRequests") */

        /* console.log(userInDb) */
        return true
      } catch (e) {
        console.log(e)
        throw new ApolloError("Something went wrong accepting the request:", e.message)
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers,
}