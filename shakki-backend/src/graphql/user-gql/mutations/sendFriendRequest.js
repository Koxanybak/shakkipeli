const { gql, AuthenticationError, ApolloError, } = require("apollo-server-express")

const typeDefs = gql`
  extend type Mutation {
    sendFriendRequest(tag: String): FriendRequest!
  }
`

const resolvers = {
  Mutation: {
    sendFriendRequest: async (root, { tag }, { pubsub, currentUser, models: { User, FriendRequest, } }) => {
      if (!currentUser || currentUser.guest) {
        throw new AuthenticationError("Invalid token")
      }

      const userInDb = await User.findById(currentUser.id)
      const friendInDb = await User.findOne({ tag })
      if ((userInDb && userInDb.tag === tag) || (!userInDb || !friendInDb)) {
        throw new ApolloError("User not found")
      }

      // they are friends already
      if ((userInDb.friends && userInDb.friends.includes(friendInDb._id)) ||
      (friendInDb.friends && friendInDb.friends.includes(userInDb._id))) {
        throw new ApolloError("The users are already friends.")
      }

      try {
        const newRequest = new FriendRequest({
          from: userInDb._id,
          to: friendInDb._id,
        })
  
        const savedReq = await newRequest.save()

        if (!userInDb.sentRequests) {
          userInDb.sentRequests = []
        }
        userInDb.sentRequests = userInDb.sentRequests.concat(savedReq._id)
        await User.findByIdAndUpdate(userInDb._id, userInDb)

        if (!friendInDb.receivedRequests) {
          friendInDb.receivedRequests = []
        }
        friendInDb.receivedRequests = friendInDb.receivedRequests.concat(savedReq._id)
        await User.findByIdAndUpdate(friendInDb._id, friendInDb)

        pubsub.publish("REQUEST_RECEIVED", { requestReceived: savedReq.toJSON() })
        return savedReq
      } catch (e) {
        console.log(e)
        throw new ApolloError("Something went wrong creating the request:", e.message)
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers,
}