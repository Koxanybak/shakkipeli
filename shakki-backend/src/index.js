const {
  ApolloServer,
  gql,
  PubSub,
  UserInputError,
  AuthenticationError,
  withFilter,
} = require("apollo-server")
const Game = require("./chess/game")
const { MONGODB_URI, SECRET } = require("./config")
const mongoose = require("mongoose")
const User = require("../data/models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const uuid = require("uuid")
const { findGame } = require("./chess/gameHelper")


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
    blackPlayer: User
    whitePlayer: User
    lastMove: Move
    id: ID!
  }
  type Piece {
    type: String!
    side: Side!
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
  }
  type UserWithToken {
    username: String!
    tag: String!
    friends: [User!]
    token: String!
    id: ID!
  }
  type Location {
    row: Int!
    column: Int!
  }
  type Move {
    piece: Piece
    oldLocation: Location
    newLocation: Location
    success: Boolean!
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
    getLoggedUser(token: String): User
  }



  type Mutation {
    createGame: Game!
    makeMove(move: MoveInput!): Game!
    addUser(user: NewUserInput!): User!
    login(username: String!, password: String!): UserWithToken!
    joinGame(gameId: String!): Game!
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
          const currentUser = await User.findById(userFromToken.id)
  
          return currentUser
        } catch (e) {
          return null
        }
      } else {
        return null
      }
    },
  },

  Mutation: {
    makeMove: (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("Invalid token")
      }
      const game = findGame(args.gameId, gamesInProgress)
      game.makeMove(
        args.move.piece,
        args.move.oldLocation,
        args.move.newLocation,
        currentUser,
      )

      if (game.lastMove.success) {
        pubsub.publish("MOVE_MADE", { moveMade: game })
      }

      return game
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
      const game = new Game(uuid(), currentUser)
      gamesInProgress.push(game)

      return game
    },

    joinGame: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("Invalid token")
      }
      const game = findGame(args.gameId, gamesInProgress)
      if (game.isFull()) {
        throw new UserInputError("The game is already full :(")
      }
      game.addPlayer(currentUser)
    },
  },

  Subscription: {
    moveMade: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["MOVE_MADE"]),
        (payload, variables) => {
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
        const currentUser = await User.findById(userFromToken.id)

        return { currentUser }
      // eslint-disable-next-line no-empty
      } catch (e) {
        
      }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl, }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})