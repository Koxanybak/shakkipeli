const { ApolloServer, gql, PubSub } = require("apollo-server")
const Game = require("./chess/game")

const pubsub = new PubSub()

const game = new Game()

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



  type Query {
    getGame: Game!
  }



  type Mutation {
    makeMove(move: MoveInput!): Game!
  }




  type Subscription {
    moveMade: Game!
  }
`

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

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url, subscriptionsUrl, }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})