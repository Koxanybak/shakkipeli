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

        const userInDB = await User.findOne({ username: validatedArgs.username })
        if (!userInDB) {
          throw new UserInputError("Wrong username or password")
        }
        const match = await bcrypt.compare(validatedArgs.password, userInDB.passwordHash)
        if (!match) {
          throw new UserInputError("Wrong username or password")
        }

        const userForToken = {
          username: userInDB.username,
          id: userInDB._id,
        }
        const token = jwt.sign(userForToken, SECRET)

        return {
          token,
          username: userInDB.username,
          tag: userInDB.tag,
          id: userInDB._id.toString()
        }
      } catch (e) {
        throw new UserInputError(e.errors.join(", "))
      }
    },
  }
}

module.exports = {
  typeDefs,
  resolvers,
}