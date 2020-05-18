const { gql, UserInputError } = require("apollo-server-express")
const bcrypt = require("bcrypt")
const yup = require("yup")

const typeDefs = gql`
  extend type Mutation {
    addUser(user: NewUserInput!): User!
  }
`

const argsSchema = yup.object({
  user: yup.object({
    username: yup
      .string()
      .min(2)
      .max(40)
      .required(),
    tag: yup
      .string()
      .min(2)
      .max(20)
      .required(),
    password: yup
      .string()
      .min(8)
      .max(50)
      .required()
  })
})

const resolvers = {
  Mutation: {
    addUser: async (root, args, { models: { User } }) => {
      try {
        const validatedArgs = argsSchema.validateSync(args)
        
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(validatedArgs.user.password, saltRounds)
      
        const newUser = new User({
          username: validatedArgs.user.username,
          passwordHash,
          tag: validatedArgs.user.tag,
        })

        try {
          await newUser.save()
          return newUser
        } catch (e) {
          throw new UserInputError(e.message)
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