const createSchema = require("./graphql")
const logger = require("./utils/logger")
const jwt = require("jsonwebtoken")
const User = require("../data/models/user")
const Match = require("../data/models/match")
const FriendRequest = require("../data/models/friendRequest")
const {
  ApolloServer,
  PubSub,
} = require("apollo-server-express")
const { MONGODB_URI, SECRET } = require("./config")
const mongoose = require("mongoose")


// connects to MongoDB database
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then(() => {
    logger.info("Connected to MongoDB")
  })
  .catch(error => {
    logger.error("Error connecting to MongoDB " + error.message)
  })

const pubsub = new PubSub()
const gamesInProgress = []


// initializes grapql server
const server = new ApolloServer({
  schema: createSchema(),
  context: async ({ req }) => {
    let context = { pubsub, gamesInProgress, models: { User, Match, FriendRequest, } }

    const auth = req ? req.headers.authorization : null
    //console.log(req)
    //console.log(auth)

    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const token = auth.substring(7)
      try {
        const userFromToken = jwt.verify(token, SECRET)
        //console.log("userFromToken:",userFromToken)
        if (userFromToken.guest) {
          return { ...context, currentUser: userFromToken }
        }
        let currentUser = await User.findById(userFromToken.id)
        //console.log("currentUser:", currentUser)

        currentUser = currentUser.toJSON()
        //console.log("currentUser:", currentUser)

        return { ...context, currentUser }
      } catch (e) {
        //console.log("virhe verifioimisessa")
        return context
      }
    } else {
      //console.log("ei ollut tokenia")
      return context
    }
  },
})

module.exports = server