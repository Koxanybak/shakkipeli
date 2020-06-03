const express = require("express")
const http = require("http")
const path = require("path")
const logger = require("./utils/logger")
const server = require("./gqlServer")


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
  logger.info(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  logger.info(`Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
})