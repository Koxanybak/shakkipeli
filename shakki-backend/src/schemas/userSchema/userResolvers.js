const jwt = require("jsonwebtoken")
const { SECRET } = require("../../config")
const { UserInputError } = require("apollo-server-express")
const bcrypt = require("bcrypt")
const { v4: uuid } = require("uuid")

const userResolvers = {
  Query: {
    getLoggedUser: async (root, args, { models: { User } }) => {
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
  
          currentUser = currentUser.toJSON()

          return {
            friends: currentUser.friends,
            username: currentUser.username,
            tag: currentUser.tag,
            id: currentUser.id,
            token: args.token,
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
        
        console.log("created a new guest")
  
        return {
          token,
          ...userForToken
        }
      }
    },
  },

  Mutation: {
    addUser: async (root, args) => {
      if (args.user.password.length < 8) {
        throw new UserInputError("Password too short")
      }
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(args.user.password, saltRounds)

      const newUser = new User({
        username: args.user.username,
        passwordHash,
        tag: args.user.tag,
      })

      try {
        await newUser.save()
        return newUser
      } catch (e) {
        throw new UserInputError(e.message)
      }
    },

    login: async (root, args) => {
      const userInDB = await User.findOne({ username: args.username })
      if (!userInDB) {
        throw new UserInputError("Wrong username or password")
      }
      const match = await bcrypt.compare(args.password, userInDB.passwordHash)
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
    },
  },
}

module.export = userResolvers