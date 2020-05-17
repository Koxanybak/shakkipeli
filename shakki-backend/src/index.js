const {
  ApolloServer,
  PubSub,
} = require("apollo-server-express")
const { mergeSchemas } = require("graphql-tools")
const { MONGODB_URI, SECRET } = require("./config")
const mongoose = require("mongoose")
const User = require("../data/models/user")
const express = require("express")
const http = require("http")
const path = require("path")
const jwt = require("jsonwebtoken")
const gameSchema = require("./gameSchema")
const userSchema = require("./userSchema")


// connects to MongoDB database
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch(error => {
    console.log("Error connecting to MongoDB " + error.message)
  })

const pubsub = new PubSub()
const schema = mergeSchemas({
  schemas: [gameSchema, userSchema]
})


// initializes grapql server
const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null

    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const token = auth.substring(7)
      try {
        const userFromToken = jwt.verify(token, SECRET)
        if (userFromToken.guest) {
          return { currentUser: userFromToken, pubsub }
        }
        let currentUser = await User.findById(userFromToken.id)

        currentUser = currentUser.toJSON()

        return { currentUser, pubsub }
      // eslint-disable-next-line no-empty
      } catch (e) {
        
      }
    }
  },
})


// adds the graphql server to express

const PORT = process.env.PORT || 4000

const app = express()
if (process.env.NODE_ENV === "production") {
  let root = path.join(__dirname, "..", "public/")
  console.log(path.join(__dirname, "..", "public/"))
  app.use(express.static(root))

  // no idea why this code fixed the syntax error in the production build
  app.use(function(req, res, next) {
    if (req.method === "GET" && req.accepts("html") && !req.is("json") && !req.path.includes(".")) {
      res.sendFile("index.html", { root })
    } else next()
  })
}
server.applyMiddleware({ app })

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(`Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
})