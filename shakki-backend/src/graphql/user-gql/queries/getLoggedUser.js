const jwt = require("jsonwebtoken")
const { SECRET } = require("../../../config")
const { gql, UserInputError } = require("apollo-server-express")
const { v4: uuid } = require("uuid")
const logger = require("../../../utils/logger")

const typeDefs = gql`
  extend type Query {
    getLoggedUser(token: String): UserWithToken!
  }
`

const resolvers = {
  Query: {
    getLoggedUser: async (root, args, { models: { User, } }) => {
      if (args.token) {
        try {
          const userFromToken = jwt.verify(args.token, SECRET)
          if (userFromToken.guest) {
            return {
              token: args.token,
              ...userFromToken
            }
          }
          let currentUser = await User.findById(userFromToken.id)
            .populate("friends")
            .populate({
              path: "sentRequests",
              populate: {
                path: "from to",
                model: User,
              }
            })
            .populate({
              path: "receivedRequests",
              populate: {
                path: "from to",
                model: User,
              }
            })

          /* console.log(currentUser) */
  
          currentUser = currentUser.toJSON()

          return {
            friends: currentUser.friends,
            username: currentUser.username,
            tag: currentUser.tag,
            id: currentUser.id,
            token: args.token,
            sentRequests: currentUser.sentRequests,
            receivedRequests: currentUser.receivedRequests,
            matches: currentUser.matches,
          }
        } catch (e) {
          throw new UserInputError("Something went wrong:", e.message)
        }
      } else {
        const id = uuid()
        const userForToken = {
          id: id,
          guest: true,
          username: `Guest${id}`,
          tag: `Guest${id}`
        }
        const token = jwt.sign(userForToken, SECRET)
        
        logger.info("created a new guest")
  
        return {
          token,
          ...userForToken
        }
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers,
}