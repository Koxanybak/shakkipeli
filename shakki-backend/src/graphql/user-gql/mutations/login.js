const { gql, UserInputError } = require("apollo-server-express")
const bcrypt = require("bcrypt")
const yup = require("yup")
const jwt = require("jsonwebtoken")
const { SECRET } = require("../../../config")

const typeDefs = gql`
  extend type Mutation {
    login(username: String!, password: String!): UserWithToken!
  }
`

const argsSchema = yup.object({
  username: yup
    .string(),
  password: yup
    .string()
})

const resolvers = {
  Mutation: {
    login: async (root, args, { models: { User } }) => {
      try {
        const validatedArgs = argsSchema.validateSync(args)

        const userInDb = await User.findOne({ username: validatedArgs.username })
          .populate("friends")
          .populate("sentRequests")
          .populate("receivedRequests")
        if (!userInDb) {
          throw new UserInputError("Wrong username or password")
        }
        const match = await bcrypt.compare(validatedArgs.password, userInDb.passwordHash)
        if (!match) {
          throw new UserInputError("Wrong username or password")
        }

        const userForToken = {
          username: userInDb.username,
          id: userInDb._id,
        }
        const token = jwt.sign(userForToken, SECRET)

        return {
          friends: userInDb.friends,
          username: userInDb.username,
          tag: userInDb.tag,
          id: userInDb.id,
          token,
          sentRequests: userInDb.sentRequests,
          receivedRequests: userInDb.receivedRequests,
          matches: userInDb.matches,
        }
      } catch (e) {
        console.log(e)
        throw new UserInputError(e)
      }
    },
  }
}

module.exports = {
  typeDefs,
  resolvers,
}