const {
  ApolloServer,
  gql,
  PubSub,
  UserInputError,
  AuthenticationError,
  withFilter,
} = require("apollo-server-express")
const Game = require("./chess/game")
const { MONGODB_URI, SECRET } = require("./config")
const mongoose = require("mongoose")
const User = require("../data/models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { v4: uuid } = require("uuid")
const { findGame } = require("./chess/gameHelper")
const express = require("express")
const http = require("http")
const path = require("path")


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

const gamesInProgress = []

// type definitions

const typeDefs = gql`
  type Game {
    board: [[Piece]!]!
    blackPlayer: String
    whitePlayer: String
    currentPlayer: String
    winner: String
    promotionPlayerID: String
    gameOver: Boolean!
    lastMove: Move
    check: Check
    id: ID!
  }
  type Check {
    threatenedSide: Side,
    movesAvailable: [Move!]!
  }
  type Piece {
    type: String!
    side: Side!
    id: String!
  }
  enum Side {
    white
    black
  }
  type User {
    username: String!
    tag: String!
    friends: [User!]
    id: ID!
    currentGameId: String
    guest: Boolean
  }
  type UserWithToken {
    username: String!
    tag: String!
    friends: [User!]
    token: String!
    id: ID!
    guest: Boolean
  }
  type Location {
    row: Int
    column: Int!
  }
  type Move {
    piece: Piece
    oldLocation: Location
    newLocation: Location
    success: Boolean
    message: String
  }



  input PieceInput {
    type: String!
    side: Side!
  }
  input LocationInput {
    row: Int!
    column: Int!
  }
  input MoveInput {
    piece: PieceInput!
    oldLocation: LocationInput!
    newLocation: LocationInput!
    gameId: String!
  }
  input NewUserInput {
    username: String!
    tag: String!
    password: String!
  }


  type Query {
    getGame(gameId: String!): Game!
    getLoggedUser(token: String): UserWithToken
  }



  type Mutation {
    createGame: Game!
    makeMove(move: MoveInput!): Game!
    addUser(user: NewUserInput!): User!
    login(username: String!, password: String!): UserWithToken!
    joinGame(gameId: String!): Game!
    promote(gameId: String!, pieceType: String!): Game!
  }




  type Subscription {
    moveMade(gameId: String!): Game!
  }
`




// resolvers

const resolvers = {
  Query: {
    getGame: (root, args) => {
      const game = findGame(args.gameId, gamesInProgress)

      return game
    },
    
    getLoggedUser: async (root, args) => {
      if (args.token) {
        try {
          const userFromToken = jwt.verify(args.token, SECRET)
          if (userFromToken.guest) {
            return {
              token: args.token,
              ...userFromToken
            }
          }
          const currentUser = await User.findById(userFromToken.id)
  
          return currentUser
        } catch (e) {
          return null
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
    makeMove: (root, args, { currentUser }) => {
      const game = findGame(args.move.gameId, gamesInProgress)

      if (!currentUser
        || (currentUser.id !== game.whitePlayer && currentUser.id !== game.blackPlayer)) {
        throw new AuthenticationError("Invalid token")
      }
      //try {
      game.makeMove(
        args.move.piece,
        args.move.oldLocation,
        args.move.newLocation,
        currentUser.id,
      )
      /*} catch (e) {
        console.log(e.stack)
      }*/

      if (game.lastMove.success) {
        //console.log("was published")
        pubsub.publish("MOVE_MADE", { moveMade: game })
      }

      return game
    },

    promote: (root, args, { currentUser }) => {
      const game = findGame(args.gameId, gamesInProgress)

      if (!currentUser
        || (currentUser.id !== game.whitePlayer && currentUser.id !== game.blackPlayer)) {
        throw new AuthenticationError("Invalid token")
      }

      if (game.promote(args.pieceType, currentUser.id)) {
        pubsub.publish("MOVE_MADE", { moveMade: game })
        return game
      }

      throw new UserInputError("Nothing to promote my friend")
    },

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

    createGame: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("Invalid token")
      }
      const game = new Game(uuid())
      gamesInProgress.push(game)

      return game
    },

    joinGame: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("Invalid token")
      }
      const game = findGame(args.gameId, gamesInProgress)
      if (game.whitePlayer === currentUser.id || game.blackPlayer === currentUser.id) {
        throw new UserInputError("You are already in the game")
      }
      if (game.isFull()) {
        throw new UserInputError("The game is already full :(")
      }
      game.addPlayer(currentUser.id)

      return game
    },
  },

  Subscription: {
    moveMade: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("MOVE_MADE"),
        (payload, variables) => {
          //console.log("payload:", payload.moveMade.id)
          //console.log("variables:", variables.gameId)
          return payload.moveMade.id === variables.gameId
        }
      )
    }
  },

  Game: {
    board: (root) => {
      return root.getBoard()
    },
    lastMove: (root) => {
      return root.lastMove
    },
    whitePlayer: (root) => {
      return root.whitePlayer
    },
    blackPlayer: (root) => {
      return root.blackPlayer
    },
    currentPlayer: (root) => {
      return root.currentPlayer
    },
    check: (root) => {
      return root.check
    }
  }
}




// initializes server

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null

    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const token = auth.substring(7)
      try {
        const userFromToken = jwt.verify(token, SECRET)
        if (userFromToken.guest) {
          return { currentUser: userFromToken }
        }
        let currentUser = await User.findById(userFromToken.id)

        currentUser = currentUser.toJSON()

        return { currentUser }
      // eslint-disable-next-line no-empty
      } catch (e) {
        
      }
    }
  }
})

const PORT = process.env.PORT || 4000

const app = express()
if (process.env.NODE_ENV === "production") {
  /*app.use(express.static("public"))
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../public/index.html"))
  })*/
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