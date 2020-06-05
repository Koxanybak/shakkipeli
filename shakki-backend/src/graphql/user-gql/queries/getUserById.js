const { gql, } = require("apollo-server-express")
const ObjectId = require("mongoose").Types.ObjectId
const logger = require("../../../utils/logger")

const isObjectId = string => {
  /* console.log("isObjectId for", string) */
  const id = new ObjectId(string)
  /* console.log("id:", id)
  console.log("id.toString()", id.toString())
  console.log("id.toHexString()", id.toHexString()) */
  return string === id.toString()
}

const typeDefs = gql`
  extend type Query {
    getUserById(userId: String): User!
  }
`

const resolvers = {
  Query: {
    getUserById: async (_, { userId }, { models: { User, } }) => {
      //logger.info("we got a req", userId)
      let isUser = false
      try {
        isUser = isObjectId(userId)
      } catch (e) {
        isUser = false
      }
      if (!isUser) {
        //logger.info("was not user")
        return {
          tag: "Anonyymi"
        }
      } else {
        //logger.info("was user")
        const userInDb = await User.findById(userId)
        if (userInDb) {
          //logger.info("found")
          return userInDb
        } else {
          logger.info("not found")
          return {
            tag: "Anonyymi"
          }
        }
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers,
}