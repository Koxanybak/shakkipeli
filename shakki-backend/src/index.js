const { ApolloServer, gql, PubSub, UserInputError, } = require("apollo-server")
const Game = require("./chess/game")
const { MONGODB_URI } = require("./config")
const mongoose = require("mongoose")
const User = require("../data/models/user")
const bcrypt = require("bcrypt")


mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch(error => {
    console.log("Error connecting to MongoDB " + error.message)
  })


const pubsub = new PubSub()

const game = new Game()

// type definitions

const typeDefs = gql`
  type Game {
    board: [[Piece]!]!
    blackPlayer: User
    whitePlayer: User
    lastMove: Move
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
  }
  type Token {
    value: String
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
    piece: PieceInput
    oldLocation: LocationInput
    newLocation: LocationInput
  }
  input UserInput {
    username: String!
    tag: String!
    password: String!
  }



  type Query {
    getGame: Game!
  }



  type Mutation {
    makeMove(move: MoveInput!): Game!
    addUser(user: UserInput!): User!
  }




  type Subscription {
    moveMade: Game!
  }
`




// resolvers

const resolvers = {
  Query: {
    getGame: () => game
  },

  Mutation: {
    makeMove: (root, args) => {
      game.makeMove(args.move.piece, args.move.oldLocation, args.move.newLocation)
      if (game.lastMove.success) {
        pubsub.publish("MOVE_MADE", { moveMade: game })
      }

      return game
    },

    addUser: (root, args) => {
      if (args.password.length < 8) {
        throw new UserInputError("Password too short")
      }
      const saltRounds = 10
      //const passwordHash
    }
  },

  Subscription: {
    moveMade: {
      subscribe: () => pubsub.asyncIterator(["MOVE_MADE"])
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




// initializing server

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url, subscriptionsUrl, }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})