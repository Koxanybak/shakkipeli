const { gql, AuthenticationError, ApolloError, } = require("apollo-server-express")

const typeDefs = gql`
  extend type Mutation {
    declineFriendRequest(requestId: String): FriendRequest!
  }
`

const resolvers = {
  Mutation: {
    declineFriendRequest: async (_, { requestId }, { currentUser, models: { User, FriendRequest, } }) => {
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
        userInDb.receivedRequests = userInDb.receivedRequests.filter(req => {
          /* console.log("req.toString()",req.toString())
          console.log("requestId",requestId)
          console.log("req.toString() !== requestId",req.toString() !== requestId) */
          return req.toString() !== requestId
        })
        friendInDb.sentRequests = friendInDb.sentRequests.filter(req => req.toString() !== requestId)

        requestInDb = await FriendRequest.findById(requestInDb._id).populate("from to")
        await User.findByIdAndUpdate(userInDb._id, userInDb)
        await User.findByIdAndUpdate(friendInDb._id, friendInDb)
        await FriendRequest.findByIdAndDelete(requestId)

        return requestInDb
      } catch (e) {
        console.log(e)
        throw new ApolloError("Something went wrong declining the request:", e.message)
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers,
}